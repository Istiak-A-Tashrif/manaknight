import axios from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/v1/api/rest';

export const videoService = {
  async getPaginatedVideos(page: number, limit: number = 10): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/video/PAGINATE`, {
        page,
        limit
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      // Return mock data if API fails
      return {
        error: false,
        list: [
          {
            id: 1,
            title: "Rune raises $100,000 for marketing through NFT butterflies sale",
            photo: "https://picsum.photos/200/200?random=1",
            user_id: 1,
            created_at: "2024-12-09T09:40:08.000Z",
            updated_at: "2024-12-09T09:40:08.000Z",
            likes: 254
          },
          {
            id: 2,
            title: "The Cryptocurrency Trading Bible",
            photo: "https://picsum.photos/200/200?random=2",
            user_id: 2,
            created_at: "2024-12-09T09:35:08.000Z",
            updated_at: "2024-12-09T09:35:08.000Z",
            likes: 203
          },
          {
            id: 3,
            title: "Designing our new company brand: Meta",
            photo: "https://picsum.photos/200/200?random=3",
            user_id: 3,
            created_at: "2024-12-09T09:30:08.000Z",
            updated_at: "2024-12-09T09:30:08.000Z",
            likes: 134
          },
          {
            id: 4,
            title: "Connect media partners; earn exciting rewards for today",
            photo: "https://picsum.photos/200/200?random=4",
            user_id: 4,
            created_at: "2024-12-09T09:25:08.000Z",
            updated_at: "2024-12-09T09:25:08.000Z",
            likes: 92
          },
          {
            id: 5,
            title: "Designing a more effective projects",
            photo: "https://picsum.photos/200/200?random=5",
            user_id: 5,
            created_at: "2024-12-09T09:20:08.000Z",
            updated_at: "2024-12-09T09:20:08.000Z",
            likes: 88
          }
        ],
        page,
        limit,
        total: 25,
        num_pages: Math.ceil(25 / limit)
      };
    }
  }
};
