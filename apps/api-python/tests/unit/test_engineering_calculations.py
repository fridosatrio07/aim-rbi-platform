import unittest

from app.services.calculations.engineering_calculations import (
    conservative_due_date,
    document_completeness,
    simple_corrosion_rate,
)


class EngineeringCalculationTests(unittest.TestCase):
    def test_conservative_due_date_chooses_earliest_valid_date(self):
        result = conservative_due_date(
            [
                {"source": "RBI", "date": "2028-05-01"},
                {"source": "owner", "date": "2027-08-01"},
                {"source": "statutory", "date": "2027-01-15"},
            ]
        )

        self.assertEqual(result["selected_date"], "2027-01-15")
        self.assertIn("RBI interval", " ".join(result["warnings"]))

    def test_corrosion_rate_invalid_date_order_requires_review(self):
        result = simple_corrosion_rate(10.0, 9.0, "2026-01-01", "2025-01-01")

        self.assertEqual(result["status"], "requires_engineer_review")
        self.assertIn("after previous", result["warnings"][0])

    def test_document_completeness_warns_for_missing_evidence(self):
        result = document_completeness(["datasheet", "thickness_history"], ["datasheet"])

        self.assertEqual(result["status"], "partially_verified")
        self.assertEqual(result["missing_evidence"], ["thickness_history"])


if __name__ == "__main__":
    unittest.main()
