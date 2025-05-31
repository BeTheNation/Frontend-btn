import { TradeHistoryResponse } from '../dto/TradeHistoryDto';

export const fetchTradeHistory = async (userId: string): Promise<TradeHistoryResponse> => {
    try {
        // console.log('Making API request to:', `https://backend.mrfql.my.id/api/v1/trade-history/${userId}`);

        const response = await fetch(`http://localhost:1000/api/v1/trade-history/663fabc9e25a4f7e9e2d4b55`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('API Error:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log('API Response data:', rawData);

        return new TradeHistoryResponse(rawData);
    } catch (error) {
        console.error('Error in fetchTradeHistory:', error);
        throw error;
    }
}; 