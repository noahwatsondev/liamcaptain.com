import { BetaAnalyticsDataClient } from '@google-analytics/data';
import AnalyticsCharts from './AnalyticsCharts';

export const revalidate = 3600; // Cache for 1 hour

async function getAnalyticsData() {
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!propertyId || !email || !key) {
        return null; // Credentials missing
    }

    try {
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: email,
                private_key: key.replace(/\\n/g, '\n'),
            },
        });

        // 1. Fetch Daily Users (Last 7 Days)
        const [dailyUsersResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'yesterday',
                },
            ],
            dimensions: [
                {
                    name: 'date',
                },
            ],
            metrics: [
                {
                    name: 'activeUsers',
                },
            ],
            orderBys: [
                {
                    dimension: {
                        orderType: 'ALPHANUMERIC',
                        dimensionName: 'date',
                    },
                },
            ],
        });

        // 2. Fetch Top Pages
        const [topPagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'yesterday',
                },
            ],
            dimensions: [
                {
                    name: 'pageTitle',
                },
            ],
            metrics: [
                {
                    name: 'screenPageViews',
                },
            ],
            limit: 10,
            orderBys: [
                {
                    metric: {
                        metricName: 'screenPageViews',
                    },
                    desc: true,
                },
            ],
        });

        // Format Data
        const dailyUsers = dailyUsersResponse.rows?.map(row => {
            // Convert YYYYMMDD to readable date
            const dateStr = row.dimensionValues?.[0].value || '';
            const formattedDate = `${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
            return {
                date: formattedDate,
                activeUsers: parseInt(row.metricValues?.[0].value || '0'),
            };
        }) || [];

        const topPages = topPagesResponse.rows?.map(row => ({
            pageTitle: row.dimensionValues?.[0].value || 'Unknown',
            screenPageViews: parseInt(row.metricValues?.[0].value || '0'),
        })) || [];

        return { dailyUsers, topPages };

    } catch (e) {
        console.error("Analytics fetch failed:", e);
        return null;
    }
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px' }}>Analytics</h1>
            </div>

            {!data ? (
                <div style={{
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                    <h2 style={{ marginBottom: '10px' }}>Connect Google Analytics</h2>
                    <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto 20px auto' }}>
                        To see your data, you need to create a <strong>Google Cloud Service Account</strong> and add the credentials to your environment variables.
                    </p>
                    <div style={{
                        background: '#f4f4f4',
                        padding: '20px',
                        borderRadius: '4px',
                        textAlign: 'left',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        display: 'inline-block'
                    }}>
                        GOOGLE_ANALYTICS_PROPERTY_ID=...<br />
                        GOOGLE_SERVICE_ACCOUNT_EMAIL=...<br />
                        GOOGLE_SERVICE_ACCOUNT_KEY=...
                    </div>
                </div>
            ) : (
                <AnalyticsCharts data={data} />
            )}
        </div>
    );
}
