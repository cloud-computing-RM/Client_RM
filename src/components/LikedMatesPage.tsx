import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Users, Heart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface LikedMatesPageProps {
  onBack: () => void;
}

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  pace: string;
  distance: string;
  bio: string;
  tags: string[];
  image: string;
}

export function LikedMatesPage({ onBack }: LikedMatesPageProps) {
  const [likedProfiles, setLikedProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('runmate_liked_profiles_data');
    if (savedData) {
      try {
        const profiles = JSON.parse(savedData);
        setLikedProfiles(profiles);
      } catch (error) {
        console.error('Error loading liked profiles:', error);
      }
    }
  }, []);

  const handleUnlike = (profileId: number) => {
    const newProfiles = likedProfiles.filter(p => p.id !== profileId);
    setLikedProfiles(newProfiles);
    
    // localStorage 업데이트
    try {
      localStorage.setItem('runmate_liked_profiles_data', JSON.stringify(newProfiles));
      const likedIds = newProfiles.map(p => p.id);
      localStorage.setItem('runmate_liked_profiles', JSON.stringify(likedIds));
    } catch (error) {
      console.error('Error updating liked profiles:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={24} />
        </button>
        <h2 className="flex-1">관심있는 메이트</h2>
      </div>

      {/* Content */}
      <div className="p-4">
        {likedProfiles.length === 0 ? (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="mb-2">아직 관심있는 메이트가 없어요</h3>
            <p className="text-gray-600">둘러보기에서 마음에 드는 메이트를 찾아보세요!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {likedProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex gap-4 p-4">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      <ImageWithFallback
                        src={profile.image}
                        alt={profile.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg">{profile.name}, {profile.age}</h3>
                        <button
                          onClick={() => handleUnlike(profile.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Heart size={20} className="text-red-500" fill="currentColor" />
                        </button>
                      </div>
                      
                      <div className="space-y-1 mb-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{profile.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock size={14} className="mr-1 flex-shrink-0" />
                          <span>{profile.pace}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users size={14} className="mr-1 flex-shrink-0" />
                          <span>{profile.distance}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {profile.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{profile.bio}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}