from __future__ import annotations

from datetime import date, datetime
from typing import Any

DAYS_PER_YEAR = 365.2425


def simple_corrosion_rate(
    previous_thickness: float | None,
    current_thickness: float | None,
    previous_date: str | None,
    current_date: str | None,
    minimum_required_thickness: float | None = None,
) -> dict[str, Any]:
    if previous_thickness is None or current_thickness is None:
        return _corrosion_warning("Previous and current thickness are required.")
    if previous_thickness <= 0 or current_thickness <= 0:
        return _corrosion_warning("Thickness values must be positive.")

    previous = _parse_date(previous_date)
    current = _parse_date(current_date)
    if previous is None or current is None:
        return _corrosion_warning("Previous and current measurement dates are required.")
    if current <= previous:
        return _corrosion_warning("Current measurement date must be after previous measurement date.")

    elapsed_years = (current - previous).days / DAYS_PER_YEAR
    if elapsed_years <= 0:
        return _corrosion_warning("Elapsed time must be greater than zero.")

    metal_loss = previous_thickness - current_thickness
    raw_rate = metal_loss / elapsed_years
    corrosion_rate = max(raw_rate, 0)
    warnings: list[str] = []

    if raw_rate < 0:
        warnings.append("Calculated loss is negative; corrosion rate is reported as zero pending engineer review.")

    remaining_life_years = None
    if minimum_required_thickness is not None:
        if corrosion_rate <= 0:
            warnings.append("Remaining life was not calculated because corrosion rate is zero or negative.")
        else:
            remaining_life_years = (current_thickness - minimum_required_thickness) / corrosion_rate
            if remaining_life_years < 0:
                warnings.append("Current thickness is below minimum required thickness; final conclusion is blocked.")

    return {
        "corrosion_rate": corrosion_rate,
        "raw_rate": raw_rate,
        "elapsed_years": elapsed_years,
        "metal_loss": metal_loss,
        "remaining_life_years": remaining_life_years,
        "status": "requires_engineer_review" if warnings else "preliminary",
        "data_quality_status": "partially_verified" if warnings else "verified",
        "warnings": warnings,
        "limitation_statement": (
            "Simple corrosion rate is deterministic support only and does not establish final "
            "fitness-for-service, remaining-life, or safe-operation conclusion."
        ),
    }


def conservative_due_date(candidates: list[dict[str, Any]]) -> dict[str, Any]:
    valid: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []
    for candidate in candidates:
        parsed = _parse_date(candidate.get("date"))
        if parsed is None:
            rejected.append({**candidate, "reason": "Missing or invalid date."})
            continue
        valid.append({**candidate, "date": parsed.isoformat(), "_parsed": parsed})

    selected = min(valid, key=lambda item: item["_parsed"], default=None)
    warnings: list[str] = []
    if selected is None:
        warnings.append("No valid due date candidate was available; engineer review is required.")
    elif any(item.get("source") == "RBI" and item["_parsed"] > selected["_parsed"] for item in valid):
        warnings.append("RBI interval was not allowed to extend beyond a more conservative candidate.")

    for item in valid:
        item.pop("_parsed", None)

    return {
        "selected_date": selected["date"] if selected else None,
        "selected_candidate": {key: value for key, value in selected.items() if key != "_parsed"} if selected else None,
        "considered_candidates": valid,
        "rejected_candidates": rejected,
        "output_status": "preliminary",
        "required_review_role": "engineer",
        "warnings": warnings,
        "limitation_statement": (
            "Due date selection is conservative decision support. Final interval extension or "
            "deferral requires authorized engineer or regulatory review."
        ),
    }


def preliminary_risk(probability_category: int, consequence_category: int, automatic_screening_allowed: bool = False) -> dict[str, Any]:
    risk_score = probability_category * consequence_category
    if risk_score >= 16:
        rank = "high"
    elif risk_score >= 10:
        rank = "medium_high"
    elif risk_score >= 5:
        rank = "medium"
    else:
        rank = "low"

    return {
        "risk_score": risk_score,
        "risk_rank": rank,
        "status": "preliminary" if automatic_screening_allowed else "requires_engineer_review",
        "required_review_role": None if automatic_screening_allowed else "engineer",
        "warnings": ["Risk ranking is preliminary and cannot change acceptance criteria automatically."],
        "limitation_statement": "PoF x CoF ranking is screening support only and is not a final RBI approval.",
    }


def document_completeness(required_evidence: list[str], available_evidence: list[str]) -> dict[str, Any]:
    available = {item for item in available_evidence if item}
    missing = [item for item in required_evidence if item not in available]
    coverage = 100 if not required_evidence else round(((len(required_evidence) - len(missing)) / len(required_evidence)) * 100)
    status = "verified" if not missing else "partially_verified" if coverage > 0 else "missing"

    return {
        "status": status,
        "coverage_percent": coverage,
        "required_evidence": required_evidence,
        "available_evidence": available_evidence,
        "missing_evidence": missing,
        "output_status": "preliminary" if not missing else "requires_engineer_review",
        "required_review_role": None if not missing else "engineer",
        "warnings": [f"Missing evidence: {', '.join(missing)}."] if missing else [],
        "limitation_statement": (
            "Document completeness confirms evidence presence only and does not issue final "
            "PLO, certificate, FFS, RLA, or safe-operation readiness."
        ),
    }


def _corrosion_warning(message: str) -> dict[str, Any]:
    return {
        "corrosion_rate": None,
        "raw_rate": None,
        "elapsed_years": None,
        "metal_loss": None,
        "remaining_life_years": None,
        "status": "requires_engineer_review",
        "data_quality_status": "missing",
        "warnings": [message],
        "limitation_statement": "Calculation cannot proceed from missing or invalid data. Engineer review is required.",
    }


def _parse_date(value: str | date | None) -> date | None:
    if value is None:
        return None
    if isinstance(value, date):
        return value
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date()
    except ValueError:
        return None
