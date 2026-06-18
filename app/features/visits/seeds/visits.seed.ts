import { CommunityRatingModel } from "../../community/models/community-rating.model";
import { createLogger } from "~/lib/logger";

const logger = createLogger("VisitsSeed");

/**
 * Seeds sample community ratings so the discover page shows data
 * even before users log visits.
 */
export async function seedCommunityRatings(): Promise<void> {
  const existing = await CommunityRatingModel.countDocuments();
  if (existing > 0) {
    logger.info("Community ratings already seeded, skipping");
    return;
  }

  const sampleShops = [
    // Tokyo
    { shopName: "Onibus Coffee", city: "Tokyo", country: "Japan", address: "2-14-1 Yakumo, Meguro", totalRating: 47, ratingCount: 10 },
    { shopName: "Bear Pond Espresso", city: "Tokyo", country: "Japan", address: "2-36-12 Kitazawa, Setagaya", totalRating: 44, ratingCount: 10 },
    { shopName: "Fuglen Tokyo", city: "Tokyo", country: "Japan", address: "1-16-11 Tomigaya, Shibuya", totalRating: 42, ratingCount: 9 },
    { shopName: "Little Nap Coffee Stand", city: "Tokyo", country: "Japan", address: "5-65-4 Yoyogi, Shibuya", totalRating: 39, ratingCount: 9 },
    { shopName: "Coffeehouse Nishiya", city: "Tokyo", country: "Japan", address: "Shinjuku, Tokyo", totalRating: 36, ratingCount: 8 },
    // Melbourne
    { shopName: "Patricia Coffee Brewers", city: "Melbourne", country: "Australia", address: "493-495 Little Bourke St", totalRating: 48, ratingCount: 10 },
    { shopName: "Seven Seeds", city: "Melbourne", country: "Australia", address: "114 Berkeley St, Carlton", totalRating: 45, ratingCount: 10 },
    { shopName: "Dukes Coffee Roasters", city: "Melbourne", country: "Australia", address: "247 Flinders Ln", totalRating: 44, ratingCount: 10 },
    { shopName: "Proud Mary", city: "Melbourne", country: "Australia", address: "172 Oxford St, Collingwood", totalRating: 43, ratingCount: 9 },
    // London
    { shopName: "Monmouth Coffee", city: "London", country: "UK", address: "27 Monmouth St, Covent Garden", totalRating: 46, ratingCount: 10 },
    { shopName: "Origin Coffee Roasters", city: "London", country: "UK", address: "65 Charlotte Rd, Shoreditch", totalRating: 43, ratingCount: 9 },
    { shopName: "Nude Espresso", city: "London", country: "UK", address: "26 Hanbury St, E1", totalRating: 41, ratingCount: 9 },
    { shopName: "Prufrock Coffee", city: "London", country: "UK", address: "23-25 Leather Ln, EC1N", totalRating: 44, ratingCount: 10 },
    // New York
    { shopName: "Stumptown Coffee Roasters", city: "New York", country: "USA", address: "30 W 8th St, Manhattan", totalRating: 45, ratingCount: 10 },
    { shopName: "Parlor Coffee", city: "New York", country: "USA", address: "11 Dean St, Brooklyn", totalRating: 42, ratingCount: 9 },
    { shopName: "Devoción", city: "New York", country: "USA", address: "69 Grand St, Brooklyn", totalRating: 47, ratingCount: 10 },
    { shopName: "Blue Bottle Coffee", city: "New York", country: "USA", address: "160 Berry St, Brooklyn", totalRating: 40, ratingCount: 9 },
    // Seoul
    { shopName: "Fritz Coffee Company", city: "Seoul", country: "South Korea", address: "Mapo-gu, Seoul", totalRating: 46, ratingCount: 10 },
    { shopName: "Anthracite Coffee Roasters", city: "Seoul", country: "South Korea", address: "Mangwon 1-dong, Mapo-gu", totalRating: 45, ratingCount: 10 },
    { shopName: "Namusairo", city: "Seoul", country: "South Korea", address: "Jongno-gu, Seoul", totalRating: 43, ratingCount: 9 },
    // Amsterdam
    { shopName: "White Label Coffee", city: "Amsterdam", country: "Netherlands", address: "Jan Evertsenstraat 136", totalRating: 44, ratingCount: 9 },
    { shopName: "Lot Sixty One Coffee Roasters", city: "Amsterdam", country: "Netherlands", address: "Kinkerstraat 112", totalRating: 43, ratingCount: 9 },
    { shopName: "Bocca Coffee", city: "Amsterdam", country: "Netherlands", address: "Kloveniersburgwal 40", totalRating: 42, ratingCount: 9 },
    // Berlin
    { shopName: "The Barn Coffee Roasters", city: "Berlin", country: "Germany", address: "Auguststraße 58", totalRating: 47, ratingCount: 10 },
    { shopName: "Bonanza Coffee Roasters", city: "Berlin", country: "Germany", address: "Oderberger Str. 35", totalRating: 44, ratingCount: 9 },
    { shopName: "Five Elephant", city: "Berlin", country: "Germany", address: "Reichenberger Str. 101, Kreuzberg", totalRating: 45, ratingCount: 10 },
    // Sydney
    { shopName: "Single O", city: "Sydney", country: "Australia", address: "60-64 Reservoir St, Surry Hills", totalRating: 45, ratingCount: 10 },
    { shopName: "Edition Coffee Roasters", city: "Sydney", country: "Australia", address: "28 Foveaux St, Surry Hills", totalRating: 42, ratingCount: 9 },
    { shopName: "Artificer Coffee", city: "Sydney", country: "Australia", address: "547 Crown St, Surry Hills", totalRating: 44, ratingCount: 9 },
  ];

  const docs = sampleShops.map((shop) => ({
    ...shop,
    averageRating: shop.totalRating / shop.ratingCount,
  }));

  await CommunityRatingModel.insertMany(docs);
  logger.info(`Seeded ${docs.length} community ratings`);
}
