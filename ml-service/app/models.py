from pydantic import BaseModel, Field
from typing import List, Optional


class ClassificationRequest(BaseModel):
    url: str = Field(..., description="The bookmark URL to classify")
    title: str = Field(..., description="The bookmark title")
    description: Optional[str] = Field(None, description="Optional bookmark description")


class ClassificationResult(BaseModel):
    category: str = Field(..., description="Predicted category")
    confidence: float = Field(..., ge=0, le=100, description="Confidence score (0-100)")
    suggested_tags: List[str] = Field(..., description="Automatically suggested tags")
