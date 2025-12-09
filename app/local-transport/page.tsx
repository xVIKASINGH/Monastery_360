"use client";

import { useState, useMemo } from "react";
import { 
  Bus, 
  Car, 
  CarFront, 
  MapPin, 
  Phone, 
  Star, 
  Clock, 
  Calendar, 
  Send, 
  Users, 
  Plane, 
  Compass
} from "lucide-react";

// The interfaces and data remain the same for functionality
interface LocalServiceExtended {
  name: string;
  icon?: string;
  category: string;
  categoryIcon?: string;
  location?: string;
  address?: string;
  businessHours: string;
  established?: string;
  rating?: string;
  totalRatings?: string;
  ratings?: string;
  phone?: string;
  user_provided_phone?: string;
  google_map_link?: string;
  notes?: string;
}

export const allServices: LocalServiceExtended[] = [
  // -------------------------------
  // SIKKIM — Transport Services
  // -------------------------------
  {
    name: "Beeranbaan Tours & Travels",
    icon: "🚗",
    category: "Car Rental / Taxi Service",
    categoryIcon: "🏢",
    location: "Tadong, Gangtok, Sikkim",
    businessHours: "Open until 11:45 PM",
    established: "2019",
    rating: "4.8",
    totalRatings: "185",
    phone: "8487862974",
    notes: "Offers car rental services; available for instant help. Alternate contact also available.",
  },
  {
    name: "Sikkim Taxi",
    icon: "🚕",
    category: "Taxi Service / Cab",
    categoryIcon: "🚖",
    location: "M G Marg, Bazar, Gangtok - 737101",
    businessHours: "Open until 11:00 PM",
    established: "2012",
    rating: "4.5",
    totalRatings: "95",
    phone: "8460194796",
    notes: "Basic taxi service listed under Gangtok, ideal for local city rides.",
  },
  {
    name: "Himalayan Car Rentals",
    icon: "🏔",
    category: "Premium Car Rental",
    categoryIcon: "🚙",
    location: "Development Area, Gangtok",
    businessHours: "24/7 Available",
    established: "2015",
    rating: "4.9",
    totalRatings: "320",
    phone: "9876543210",
    notes: "Premium vehicles for luxury travel and long highway trips.",
  },
  {
    name: "Sikkim Tours & Travels",
    icon: "🗺",
    category: "Tour Operator",
    categoryIcon: "🌄",
    location: "Tibet Road, Gangtok",
    businessHours: "9:00 AM - 9:00 PM",
    established: "2010",
    rating: "4.7",
    totalRatings: "215",
    phone: "9123456789",
    notes: "Complete tour packages for Sikkim including permits and guided tours.",
  },
  {
    name: "North Sikkim Cabs",
    icon: "🚐",
    category: "Mountain Taxi Service",
    categoryIcon: "🏔",
    location: "Lal Bazaar, Gangtok",
    businessHours: "6:00 AM - 10:00 PM",
    established: "2017",
    rating: "4.6",
    totalRatings: "142",
    phone: "9988776655",
    notes: "Specialized in North Sikkim routes like Lachen, Lachung and Gurudongmar.",
  },
  {
    name: "Airport Transfer Service",
    icon: "✈",
    category: "Airport Pickup & Drop",
    categoryIcon: "🚗",
    location: "Pakyong Airport, Sikkim",
    businessHours: "24/7 Available",
    established: "2018",
    rating: "4.8",
    totalRatings: "278",
    phone: "9445566778",
    notes: "Direct airport transfers to Gangtok and nearby towns.",
  },

  // -------------------------------
  // SIKKIM — Extra Verified Listings
  // -------------------------------
  {
    name: "Ne Taxi",
    icon: "🚕",
    category: "Car Rental / Taxi Service",
    categoryIcon: "🚖",
    location: "Tadong, Gangtok, Sikkim",
    address: "Below Central Bank, Opp Comfort Inn, Gairiqoan, Tadong, Gangtok",
    businessHours: "Open 24 Hrs",
    established: "2013",
    rating: "4.3",
    totalRatings: "211",
    ratings: "4.3 (211 ratings)",
    phone: "+91 80010 00199 / +91 80010 00195",
    user_provided_phone: "+917947411566",
    google_map_link: "",
    notes: "12+ years in business. Awarded State Award (Government of Sikkim, 2018).",
  },
  {
    name: "Ontaxi Services",
    icon: "🚙",
    category: "Car Rental",
    categoryIcon: "🚗",
    location: "Gangtok Bazar, Gangtok, Sikkim",
    address: "Gangtok Bazar, Gangtok",
    businessHours: "Open until 7:00 PM",
    established: "2020",
    rating: "4.9",
    totalRatings: "27",
    ratings: "4.9 (27 ratings)",
    phone: "+91 80010 00199 / +91 74790 49115",
    google_map_link: "",
    notes: "Verified operator, taxi services starting at ₹4,500 for sightseeing and outstation trips.",
  },

  // -------------------------------
  // SIKKIM — Additional Mock Services
  // -------------------------------
  {
    name: "MG Marg City Cabs",
    icon: "🚕",
    category: "City Taxi Service",
    categoryIcon: "🏙",
    location: "MG Marg, Gangtok, Sikkim",
    businessHours: "7:00 AM - 10:30 PM",
    established: "2016",
    rating: "4.4",
    totalRatings: "132",
    phone: "7000012345",
    notes: "Ideal for short city rides, shopping runs and cafe hopping around Gangtok.",
  },
  {
    name: "Pelling Hill Cabs",
    icon: "🚐",
    category: "Sightseeing Taxi Service",
    categoryIcon: "🌄",
    location: "Pelling, West Sikkim",
    businessHours: "6:30 AM - 9:00 PM",
    established: "2014",
    rating: "4.7",
    totalRatings: "88",
    phone: "7001122233",
    notes: "Covers Pemayangtse, Rabdentse Ruins, Skywalk and nearby viewpoints.",
  },
  {
    name: "Ravangla Shuttle & Tours",
    icon: "🚐",
    category: "Local Shuttle / Tour Service",
    categoryIcon: "🛺",
    location: "Ravangla, South Sikkim",
    businessHours: "7:00 AM - 8:30 PM",
    established: "2018",
    rating: "4.6",
    totalRatings: "64",
    phone: "7001456789",
    notes: "Daily shuttles to Buddha Park, Ralang Monastery and nearby villages.",
  },
  {
    name: "Lachen & Lachung Roadline",
    icon: "🚌",
    category: "Mountain Route Operator",
    categoryIcon: "🏔",
    location: "Vajra Stand, Gangtok, Sikkim",
    businessHours: "5:30 AM - 7:00 PM",
    established: "2011",
    rating: "4.5",
    totalRatings: "156",
    phone: "7001987654",
    notes: "Shared and private vehicles for North Sikkim circuits including Gurudongmar and Yumthang.",
  },
  {
    name: "Zero Point Expedition Rides",
    icon: "🚙",
    category: "Off-road Expedition Taxi",
    categoryIcon: "🧭",
    location: "Lachung, North Sikkim",
    businessHours: "6:00 AM - 5:00 PM",
    established: "2019",
    rating: "4.8",
    totalRatings: "73",
    phone: "7001765432",
    notes: "Specialized jeeps for snow routes and high-altitude sectors up to Zero Point (Yumesamdong).",
  },
  {
    name: "Pakyong Airport Prepaid Taxi Booth",
    icon: "🚖",
    category: "Airport Taxi Counter",
    categoryIcon: "✈",
    location: "Pakyong Airport, Sikkim",
    businessHours: "Flight Operational Hours",
    established: "2018",
    rating: "4.2",
    totalRatings: "190",
    phone: "Not Available",
    notes: "Official prepaid counter for fixed-rate taxis to Gangtok and nearby towns.",
  },
  {
    name: "Namchi Local Cabs",
    icon: "🚕",
    category: "City & Temple Taxi",
    categoryIcon: "🛕",
    location: "Namchi, South Sikkim",
    businessHours: "7:00 AM - 9:00 PM",
    established: "2015",
    rating: "4.5",
    totalRatings: "54",
    phone: "7001678901",
    notes: "Covers Char Dham, Samdruptse and local monasteries around Namchi.",
  },
];

export default function TransportPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamically generate unique categories and their corresponding icons
  const uniqueCategories = useMemo(() => {
    const categories = allServices.reduce((acc, s) => {
      // Map main category names for grouping and cleaner display
      let mainCategory = s.category;
      let icon = CarFront;

      if (mainCategory.includes("Taxi") || mainCategory.includes("Cab")) {
        mainCategory = "Taxi & City Cabs";
        icon = CarFront;
      } else if (mainCategory.includes("Rental") || mainCategory.includes("Premium Car")) {
        mainCategory = "Car Rentals (Self/Driver)";
        icon = Car;
      } else if (mainCategory.includes("Mountain") || mainCategory.includes("Expedition")) {
        mainCategory = "Mountain & Outstation";
        icon = Bus;
      } else if (mainCategory.includes("Airport") || mainCategory.includes("Transfer")) {
        mainCategory = "Airport Transfers";
        icon = Plane;
      } else if (mainCategory.includes("Tour Operator") || mainCategory.includes("Shuttle")) {
        mainCategory = "Tours & Shuttles";
        icon = Compass;
      }

      if (!acc.find(c => c.name === mainCategory)) {
        acc.push({ name: mainCategory, icon });
      }
      return acc;
    }, [] as { name: string; icon: React.ElementType }[]);

    categories.unshift({ name: "All", icon: Users });
    return categories;
  }, []);

  const filteredServices = allServices.filter((s) => {
    if (selectedCategory === "All") return true;

    // Filter logic to match the grouped category names
    if (selectedCategory === "Taxi & City Cabs") {
      return s.category.includes("Taxi") || s.category.includes("Cab") || s.category.includes("City Taxi");
    }
    if (selectedCategory === "Car Rentals (Self/Driver)") {
      return s.category.includes("Rental") || s.category.includes("Premium Car");
    }
    if (selectedCategory === "Mountain & Outstation") {
      return s.category.includes("Mountain") || s.category.includes("Expedition");
    }
    if (selectedCategory === "Airport Transfers") {
      return s.category.includes("Airport") || s.category.includes("Transfer");
    }
    if (selectedCategory === "Tours & Shuttles") {
      return s.category.includes("Tour Operator") || s.category.includes("Shuttle");
    }

    return false;
  });


  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO SECTION (Sleek & Clean) */}
      <section className="relative overflow-hidden py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find <span className="text-yellow-600">Verified Transport</span> in Sikkim
          </h1>

          <p className="mt-3 text-lg text-gray-500 max-w-3xl mx-auto">
            Trusted Taxi, Cab Rentals, and Tour Operators for local travel and outstation circuits across Gangtok, Pelling & North Sikkim.
          </p>
        </div>
      </section>

      {/* 2. FILTER BUTTONS (JustDial-style Tabs) */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 ml-2">Browse by Service Type:</h2>
        <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 overflow-x-auto pb-4">
          {uniqueCategories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(c.name)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm border
                  ${isSelected
                    ? "bg-yellow-500 text-white border-yellow-500 shadow-md transform scale-[1.02] active:scale-100"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
              >
                <Icon size={18} className={isSelected ? "text-white" : "text-yellow-600"} />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* 3. SERVICE CARDS (Sleek & Dense Information) */}
      <section className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => {
          const mainContact = service.phone || service.user_provided_phone || 'Contact N/A';
          const ratingValue = parseFloat(service.rating || '0');
          const isVerified = service.notes?.includes("Verified operator") || service.notes?.includes("State Award");
          
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              
              {/* Card Header (Title & Verification) */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    {service.name}
                  </h3>
                  {isVerified && (
                    <span className="text-xs font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                      ✅ Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-yellow-600 font-medium">{service.category}</span>
              </div>

              {/* Card Body (Info Grid) */}
              <div className="p-4 space-y-3 flex-grow">
                
                {/* Rating */}
                <div className="flex items-center text-sm font-semibold text-gray-800">
                  <Star size={16} className="text-yellow-500 mr-2" fill="#FBBF24" />
                  <span className="text-lg text-gray-900">{service.rating || "N/A"}</span>
                  <span className="text-gray-500 font-normal ml-1">({service.totalRatings || "0 ratings"})</span>
                </div>
                
                {/* Location */}
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin size={16} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{service.location || "Multiple Locations"}</p>
                    {service.address && <p className="text-xs italic mt-0.5">{service.address}</p>}
                  </div>
                </div>

                {/* Business Hours & Established */}
                <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-100 pt-3">
                    <div className="flex items-center">
                        <Clock size={14} className="text-blue-500 mr-2" />
                        <span className="font-medium text-gray-700">{service.businessHours}</span>
                    </div>
                    <div className="flex items-center text-xs">
                         <Calendar size={14} className="text-gray-400 mr-1" />
                        Est. {service.established || "N/A"}
                    </div>
                </div>

                {/* Notes/Highlights */}
                {service.notes && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-1">Highlights:</p>
                    <p className="text-sm text-gray-700 italic leading-snug">
                      {service.notes}
                    </p>
                  </div>
                )}
                
              </div>

              {/* Card Footer (Buttons) */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between space-x-3 rounded-b-xl">
                
                <a
                  href={`tel:${mainContact.replace(/\s/g, '').split('/')[0].replace(/\+/g, '')}`}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg transition-all duration-200 text-base font-semibold shadow hover:bg-yellow-600"
                >
                  <Phone size={18} />
                  <span>Call {mainContact.split('/')[0].trim().substring(0, 10)}...</span>
                </a>

                {service.google_map_link && (
                  <a
                    href={service.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium border border-gray-300"
                  >
                    <MapPin size={18} className="mr-2 text-red-500" />
                    Map
                  </a>
                )}
              </div>

            </div>
          );
        })}
      </section>
      
      {/* Fallback for no results */}
      {filteredServices.length === 0 && (
        <div className="container mx-auto px-4 py-20 text-center">
          <Send size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600">No services found for "{selectedCategory}". Try selecting "All".</p>
        </div>
      )}

    </div>
  );
}