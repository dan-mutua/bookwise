export interface ClassificationRequest {
  url: string;
  title: string;
  description?: string;
}

export interface ClassificationResult {
  category: string;
  confidence: number;
  suggested_tags: string[];
}
