import { CronJob } from "encore.dev/cron";
import { api } from "encore.dev/api";
import db from "../db";
import { recommendations } from "~encore/clients";

export const updateAllRecommendations = api({}, async () => {
  console.log("Starting daily recommendations update...");
  
  const users: { user_id: string }[] = [];
  for await (const user of db.query<{ user_id: string }>`
    SELECT DISTINCT user_id FROM clothing_items
  `) {
    users.push(user);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const user of users) {
    try {
      await recommendations.generate({ userId: user.user_id });
      successCount++;
      console.log(`Updated recommendations for user: ${user.user_id}`);
    } catch (error) {
      errorCount++;
      console.error(`Failed to update recommendations for user ${user.user_id}:`, error);
    }
  }
  
  console.log(`Daily update complete. Success: ${successCount}, Errors: ${errorCount}`);
  
  return {
    timestamp: new Date().toISOString(),
    totalUsers: users.length,
    successCount,
    errorCount,
  };
});

const _ = new CronJob("daily-recommendations-update", {
  title: "Daily Recommendations Update",
  every: "24h",
  endpoint: updateAllRecommendations,
});
