# 06_schedule

## Inputs
../03_create/output/drop.json; ../05_review/output/approval.json; connected provider integration IDs

## Job
call the governed schedule API and preserve the provider response

## Outputs
output/receipt.json

## Human check
stop on ambiguity, missing integration IDs, missing media, auth failure, or provider failure
