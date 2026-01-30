from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import ClassificationRequest, ClassificationResult
from .classifier import URLClassifier

app = FastAPI(
    title="BookWise ML Service",
    description="Machine Learning service for bookmark classification",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize classifier
classifier = URLClassifier()


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "ml-service"}


@app.post("/classify", response_model=ClassificationResult)
async def classify_bookmark(request: ClassificationRequest):
    """
    Classify a bookmark and generate suggested tags.

    Args:
        request: Classification request with URL, title, and optional description

    Returns:
        Classification result with category, confidence, and suggested tags
    """
    try:
        category, confidence, suggested_tags = classifier.classify(
            request.url,
            request.title,
            request.description,
        )

        return ClassificationResult(
            category=category,
            confidence=confidence,
            suggested_tags=suggested_tags,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Classification failed: {str(e)}"
        )


@app.get("/")
async def root():
    """Root endpoint with service info."""
    return {
        "service": "BookWise ML Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "classify": "/classify",
        },
    }
