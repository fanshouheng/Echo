param(
    [switch]$Json,
    [switch]$RequireTasks,
    [switch]$IncludeTasks
)

# Check prerequisites for task generation/implementation
$ErrorActionPreference = "Stop"

# Determine feature directory (assuming mvp for now)
$FeatureDir = Join-Path $PSScriptRoot "..\..\features\mvp"
$FeatureDir = [System.IO.Path]::GetFullPath($FeatureDir)

# Check which documents are available
$AvailableDocs = @()

$RequiredDocs = @{
    "plan.md" = Join-Path $FeatureDir "plan.md"
    "spec.md" = Join-Path $FeatureDir "spec.md"
}

$OptionalDocs = @{
    "data-model.md" = Join-Path $FeatureDir "data-model.md"
    "research.md" = Join-Path $FeatureDir "research.md"
    "quickstart.md" = Join-Path $FeatureDir "quickstart.md"
}

# Add tasks.md to required if -RequireTasks is specified
if ($RequireTasks) {
    $RequiredDocs["tasks.md"] = Join-Path $FeatureDir "tasks.md"
}

# Check required documents
foreach ($doc in $RequiredDocs.Keys) {
    $path = $RequiredDocs[$doc]
    if (Test-Path $path) {
        $AvailableDocs += @{
            name = $doc
            path = $path
            required = $true
        }
    } else {
        Write-Error "Required document missing: $path"
        exit 1
    }
}

# Check optional documents
foreach ($doc in $OptionalDocs.Keys) {
    $path = $OptionalDocs[$doc]
    if (Test-Path $path) {
        $AvailableDocs += @{
            name = $doc
            path = $path
            required = $false
        }
    }
}

# Check contracts directory
$ContractsDir = Join-Path $FeatureDir "contracts"
if (Test-Path $ContractsDir) {
    $AvailableDocs += @{
        name = "contracts"
        path = $ContractsDir
        required = $false
    }
}

# Output results
if ($Json) {
    $result = @{
        FEATURE_DIR = $FeatureDir
        AVAILABLE_DOCS = $AvailableDocs | ForEach-Object {
            @{
                name = $_.name
                path = $_.path
                required = $_.required
            }
        }
    }
    
    $result | ConvertTo-Json -Depth 10
} else {
    Write-Host "Feature Directory: $FeatureDir"
    Write-Host "`nAvailable Documents:"
    foreach ($doc in $AvailableDocs) {
        $status = if ($doc.required) { "[REQUIRED]" } else { "[OPTIONAL]" }
        Write-Host "  $status $($doc.name) - $($doc.path)"
    }
}
