
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Bot, 
  Zap, 
  Shield,
  TrendingUp,
  Activity
} from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            LeviPro Elite
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            מערכת בינה מלאכותית מתקדמת למסחר בקריפטו
          </p>
          <Badge variant="default" className="bg-green-600 text-lg px-4 py-2">
            <Activity className="h-4 w-4 mr-2" />
            מערכת פעילה
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Bot className="h-6 w-6 text-blue-400" />
                AI Trading Engine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                מנוע מסחר חכם עם בינה מלאכותית מתקדמת לזיהוי הזדמנויות מסחר
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-6 w-6 text-yellow-400" />
                Real-Time Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                איתותי מסחר בזמן אמת עם ניתוח טכני מתקדם ואישור רב-מסגרות זמן
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BarChart3 className="h-6 w-6 text-green-400" />
                Technical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                ניתוח טכני מקיף עם אינדיקטורים מתקדמים וזיהוי תבניות
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-white">התחל עכשיו</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link to="/login">
                    התחברות
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/signup">
                    הרשמה
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">24/7</div>
            <div className="text-gray-300">פעילות רציפה</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">AI</div>
            <div className="text-gray-300">בינה מלאכותית</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">⚡</div>
            <div className="text-gray-300">זמן אמת</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">📱</div>
            <div className="text-gray-300">טלגרם</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
