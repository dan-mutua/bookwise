import re
from typing import Dict, List, Tuple
from urllib.parse import urlparse


class URLClassifier:
    """Rule-based bookmark classifier using domain and keyword matching."""

    CATEGORIES = [
        'technology',
        'news',
        'social',
        'entertainment',
        'shopping',
        'education',
        'reference',
    ]

    # Domain to category mapping
    DOMAIN_PATTERNS = {
        'technology': [
            'github.com', 'stackoverflow.com', 'gitlab.com', 'bitbucket.org',
            'dev.to', 'hackernoon.com', 'medium.com', 'techcrunch.com',
            'arstechnica.com', 'theverge.com', 'wired.com', 'engadget.com',
        ],
        'news': [
            'cnn.com', 'bbc.com', 'nytimes.com', 'theguardian.com',
            'reuters.com', 'apnews.com', 'bloomberg.com', 'wsj.com',
        ],
        'social': [
            'twitter.com', 'x.com', 'facebook.com', 'instagram.com',
            'linkedin.com', 'reddit.com', 'tiktok.com', 'pinterest.com',
        ],
        'entertainment': [
            'youtube.com', 'netflix.com', 'spotify.com', 'twitch.tv',
            'imdb.com', 'rottentomatoes.com', 'soundcloud.com',
        ],
        'shopping': [
            'amazon.com', 'ebay.com', 'etsy.com', 'aliexpress.com',
            'walmart.com', 'target.com', 'bestbuy.com',
        ],
        'education': [
            'coursera.org', 'udemy.com', 'khanacademy.org', 'edx.org',
            'mit.edu', 'stanford.edu', 'harvard.edu', 'udacity.com',
        ],
        'reference': [
            'wikipedia.org', 'stackoverflow.com', 'docs.python.org',
            'developer.mozilla.org', 'w3schools.com', 'github.io',
        ],
    }

    # Keywords for content-based classification
    KEYWORD_PATTERNS = {
        'technology': [
            'programming', 'software', 'developer', 'code', 'api', 'framework',
            'library', 'tutorial', 'documentation', 'git', 'python', 'javascript',
        ],
        'news': [
            'breaking', 'latest', 'update', 'report', 'analysis', 'politics',
            'world', 'business', 'economy',
        ],
        'social': [
            'share', 'post', 'tweet', 'follow', 'profile', 'community',
        ],
        'entertainment': [
            'video', 'music', 'movie', 'show', 'watch', 'listen', 'stream',
            'episode', 'season',
        ],
        'shopping': [
            'buy', 'shop', 'price', 'deal', 'sale', 'product', 'cart',
            'order', 'shipping',
        ],
        'education': [
            'course', 'learn', 'tutorial', 'lesson', 'study', 'teaching',
            'class', 'university', 'college',
        ],
        'reference': [
            'wiki', 'documentation', 'reference', 'guide', 'manual', 'docs',
            'specification', 'standard',
        ],
    }

    def classify(self, url: str, title: str, description: str = None) -> Tuple[str, float, List[str]]:
        """
        Classify a bookmark based on URL, title, and optional description.

        Returns:
            Tuple of (category, confidence, suggested_tags)
        """
        # Extract domain
        domain = self._extract_domain(url)

        # Calculate category scores
        scores: Dict[str, float] = {cat: 0.0 for cat in self.CATEGORIES}

        # Domain matching (base 60% confidence)
        for category, domains in self.DOMAIN_PATTERNS.items():
            if any(d in domain for d in domains):
                scores[category] += 60.0

        # Keyword matching in URL (10% per match, max 30%)
        url_lower = url.lower()
        for category, keywords in self.KEYWORD_PATTERNS.items():
            matches = sum(1 for kw in keywords if kw in url_lower)
            scores[category] += min(matches * 10, 30)

        # Keyword matching in title (10% per match, max 30%)
        if title:
            title_lower = title.lower()
            for category, keywords in self.KEYWORD_PATTERNS.items():
                matches = sum(1 for kw in keywords if kw in title_lower)
                scores[category] += min(matches * 10, 30)

        # Keyword matching in description (5% per match, max 20%)
        if description:
            desc_lower = description.lower()
            for category, keywords in self.KEYWORD_PATTERNS.items():
                matches = sum(1 for kw in keywords if kw in desc_lower)
                scores[category] += min(matches * 5, 20)

        # Find best category
        best_category = max(scores, key=scores.get)
        confidence = min(scores[best_category], 100.0)

        # If confidence is too low, default to uncategorized
        if confidence < 10:
            best_category = 'uncategorized'
            confidence = 0.0

        # Generate suggested tags
        suggested_tags = self._generate_tags(url, title, domain)

        return best_category, confidence, suggested_tags

    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL."""
        try:
            parsed = urlparse(url)
            domain = parsed.netloc or parsed.path
            # Remove www. prefix
            if domain.startswith('www.'):
                domain = domain[4:]
            return domain
        except:
            return ''

    def _generate_tags(self, url: str, title: str, domain: str) -> List[str]:
        """Generate suggested tags from URL and title."""
        tags = []

        # Add domain as tag (without TLD)
        if domain:
            base_domain = domain.split('.')[0]
            if base_domain and len(base_domain) > 2:
                tags.append(base_domain.lower())

        # Extract meaningful words from title (3+ chars, not common words)
        if title:
            # Remove special characters and split
            words = re.findall(r'\b[a-zA-Z]{3,}\b', title.lower())
            # Filter out common words
            common_words = {
                'the', 'and', 'for', 'with', 'from', 'that', 'this',
                'your', 'you', 'are', 'was', 'were', 'been', 'have',
                'has', 'had', 'can', 'will', 'would', 'could', 'should',
            }
            meaningful = [w for w in words if w not in common_words]
            # Add first 2-3 meaningful words
            tags.extend(meaningful[:3])

        # Deduplicate while preserving order
        seen = set()
        unique_tags = []
        for tag in tags:
            if tag not in seen:
                seen.add(tag)
                unique_tags.append(tag)

        return unique_tags[:5]  # Max 5 tags
