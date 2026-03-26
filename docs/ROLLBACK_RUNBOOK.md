# Rollback Runbook

## Purpose
Provide a quick, repeatable rollback process for bad releases (app or model).

## Preconditions
- CI must be green for all promoted commits.
- Deployment hooks must be configured in GitHub secrets.
- Model versions must be registered in MLflow with aliases.

## App rollback (frontend/backend)
1. Identify last known-good commit on `main`.
2. Revert bad commit(s) via new commit.
3. Push to `main` to trigger deploy workflow.
4. Validate:
   - `GET /health/ready`
   - Key prediction endpoint
   - Frontend critical page load

## Model rollback
1. Open MLflow registry for `healthpredict-diabetes`.
2. Re-point `production` alias to previous stable version.
3. Confirm `Backend/models/manifest.json` points to expected serving artifact path and version metadata.
4. Restart backend deployment if needed.
5. Validate a fixed smoke-test request against `/predict/diabetes`.

## Incident checklist
- Capture incident start time and impact scope.
- Capture request IDs/log snippets for failed predictions.
- Verify metrics (`/metrics`) and error trends.
- Announce recovery and postmortem owner.

## Post-incident actions
- Add regression test for failure mode.
- Update promotion thresholds if model quality regression occurred.
- Patch docs and alerting thresholds.
