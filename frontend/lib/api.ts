const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  isFavorite: boolean;
  mlCategory?: string;
  mlConfidence?: number;
  tags: Tag[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookmarkDto {
  url: string;
  title: string;
  description?: string;
  tags?: string[];
}

export interface UpdateBookmarkDto {
  title?: string;
  description?: string;
  isFavorite?: boolean;
}

export interface QueryBookmarkDto {
  search?: string;
  category?: string;
  isFavorite?: boolean;
  tags?: string[];
  limit?: number;
  offset?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Bookmarks
  async getBookmarks(query?: QueryBookmarkDto): Promise<Bookmark[]> {
    const params = new URLSearchParams();
    if (query?.search) params.append('search', query.search);
    if (query?.category) params.append('category', query.category);
    if (query?.isFavorite !== undefined) params.append('isFavorite', String(query.isFavorite));
    if (query?.tags) query.tags.forEach(tag => params.append('tags', tag));
    if (query?.limit) params.append('limit', String(query.limit));
    if (query?.offset) params.append('offset', String(query.offset));

    const queryString = params.toString();
    return this.request(`/api/bookmarks${queryString ? `?${queryString}` : ''}`);
  }

  async getBookmark(id: string): Promise<Bookmark> {
    return this.request(`/api/bookmarks/${id}`);
  }

  async createBookmark(data: CreateBookmarkDto): Promise<Bookmark> {
    return this.request('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookmark(id: string, data: UpdateBookmarkDto): Promise<Bookmark> {
    return this.request(`/api/bookmarks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBookmark(id: string): Promise<void> {
    return this.request(`/api/bookmarks/${id}`, {
      method: 'DELETE',
    });
  }

  async addTagsToBookmark(id: string, tagIds: string[]): Promise<Bookmark> {
    return this.request(`/api/bookmarks/${id}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tagIds }),
    });
  }

  async removeTagFromBookmark(id: string, tagId: string): Promise<Bookmark> {
    return this.request(`/api/bookmarks/${id}/tags/${tagId}`, {
      method: 'DELETE',
    });
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return this.request('/api/tags');
  }

  async createTag(name: string, color?: string): Promise<Tag> {
    return this.request('/api/tags', {
      method: 'POST',
      body: JSON.stringify({ name, color }),
    });
  }

  async updateTag(id: string, name?: string, color?: string): Promise<Tag> {
    return this.request(`/api/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, color }),
    });
  }

  async deleteTag(id: string): Promise<void> {
    return this.request(`/api/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUser(id: string): Promise<User> {
    return this.request(`/api/users/${id}`);
  }

  async createUser(email: string, password: string, name: string): Promise<User> {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }
}

export const api = new ApiClient(API_URL);
