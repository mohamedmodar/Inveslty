import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from './Navbar';

const InvestmentResultPage = () => {
    const location = useLocation();
    const { advice } = location.state || {};

    if (!advice) {
        return (
            <div className="bg-gray-100 min-h-screen">
                <Navbar />
                <main className="max-w-4xl mx-auto py-8 px-4 text-center">
                    <h1 className="text-2xl font-semibold text-red-600">No Investment Advice Found</h1>
                    <p className="mt-4">
                        Please go back to the
                        <Link to="/investment" className="text-green-600 hover:underline"> questionnaire </Link>
                        and submit your profile to get advice.
                    </p>
                </main>
            </div>
        );
    }

    // Helper function to render a list of items from a comma-separated string
    const renderFeatures = (itemsString, colorClass) => {
        if (!itemsString) return null;
        const items = itemsString.split(',').map(item => item.trim());
        return (
            <ul className="list-disc list-inside space-y-1">
                {items.map((item, index) => (
                    <li key={index} className={colorClass}>
                        {item}
                    </li>
                ))}
            </ul>
        );
    };

    // Accessing data based on the new JSON structure
    const realEstate = advice?.real_estate;
    const gold = advice?.gold;
    const usd = advice?.usd;
    const bestOption = advice?.bestOption;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="max-w-6xl mx-auto py-10 px-6">
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Your Investment Recommendation</h1>

           

                {/* Main Grid for Investment Options */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Real Estate Section */}
                    {realEstate?.map((area, index) => (
                         <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <h2 className="text-2xl font-semibold text-green-600 mb-4">{area.area}</h2>
                            <div className="space-y-3 flex-grow">
                                <p><strong>Apartment Size:</strong> {area.apartment_size}</p>
                                <p><strong>Neighborhoods:</strong> {area.neighbourhoods}</p>
                                <p><strong>Potential Earnings:</strong> {area.potential_earnings}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-green-700">Pros:</h4>
                                    {renderFeatures(area.pros, 'text-green-700')}
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-red-700">Cons:</h4>
                                    {renderFeatures(area.cons, 'text-red-700')}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Gold Section */}
                    {gold && (
                        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <h2 className="text-2xl font-semibold text-yellow-500 mb-4">Gold</h2>
                            <div className="space-y-3 flex-grow">
                                <p><strong>Return Range:</strong> {gold.return_range}</p>
                                <p><strong>Potential Earnings:</strong> {gold.potential_earnings}</p>
                                <p><strong>Liquidity:</strong> <span className="font-semibold">{gold.liquidity}</span></p>
                                <p><strong>Risk Level:</strong> {gold.risk_level}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-green-700">Pros:</h4>
                                    {renderFeatures(gold.pros, 'text-green-700')}
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-red-700">Cons:</h4>
                                    {renderFeatures(gold.cons, 'text-red-700')}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* USD Section */}
                    {usd && (
                        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <h2 className="text-2xl font-semibold text-blue-500 mb-4">USD</h2>
                            <div className="space-y-3 flex-grow">
                                <p><strong>Return Range:</strong> {usd.return_range}</p>
                                <p><strong>Potential Earnings:</strong> {usd.potential_earnings}</p>
                                <p><strong>Liquidity:</strong> <span className="font-semibold">{usd.liquidity}</span></p>
                                <p><strong>Risk Level:</strong> {usd.risk_level}</p>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-green-700">Pros:</h4>
                                    {renderFeatures(usd.pros, 'text-green-700')}
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2 text-red-700">Cons:</h4>
                                    {renderFeatures(usd.cons, 'text-red-700')}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                     {/* Final Decision / Best Option Section */}
                     {bestOption && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 border-l-4 border-green-500">
                        <h2 className="text-3xl font-bold text-green-600 mb-4">Your Best Option</h2>
                        <div className="space-y-4 text-gray-700">
                            <p><strong>Comparison of Options:</strong> {bestOption.comparison}</p>
                            <p><strong>Recommendation:</strong> <span className="font-semibold">{bestOption.recommendation}</span></p>
                    
                            <p><strong>Suggested Diversified Plan:</strong> {bestOption.diversified_plan}</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InvestmentResultPage;