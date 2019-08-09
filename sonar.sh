#!/usr/bin/env bash
branch=$(git rev-parse --abbrev-ref HEAD)
sonar-scanner -Dsonar.branch.name="$branch" "$@"