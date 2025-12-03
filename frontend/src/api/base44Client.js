// Mock API client for development
// This simulates the base44 API structure used in the app

class MockAPI {
  constructor() {
    this.complaints = [
      {
        id: 1,
        title: "Broken street light on Main St",
        description: "The street light has been flickering and needs repair",
        category: "utilities",
        status: "pending",
        location: { lat: 40.7128, lng: -74.0060 },
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-01')
      },
      {
        id: 2,
        title: "Pothole on 5th Avenue",
        description: "Large pothole causing traffic issues",
        category: "road",
        status: "resolved",
        location: { lat: 40.7589, lng: -73.9851 },
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-11-02')
      }
    ];
  }
}

export const base44 = {
  entities: {
    Complaint: {
      list: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return new MockAPI().complaints;
      },
      create: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newComplaint = {
          id: Date.now(),
          ...data,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return newComplaint;
      }
    }
  }
};