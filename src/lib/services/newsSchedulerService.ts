
const SCHEDULER_ACTIVE_KEY = 'newsSchedulerActive';

export class NewsSchedulerService {
  /**
   * Schedules the daily news fetch at 6:00 AM
   */
  static scheduleDailyFetch(fetchCallback: () => Promise<any>): void {
    // Check if already scheduled
    if (localStorage.getItem(SCHEDULER_ACTIVE_KEY) === 'true') {
      console.log('News scheduler already active');
      return;
    }

    // Initial fetch
    fetchCallback()
      .then(() => {
        console.log('Initial news fetch completed');
      })
      .catch(error => {
        console.error('Error in initial news fetch:', error);
      });

    // Schedule next run
    this.scheduleNextRun(fetchCallback);
    
    // Mark as scheduled
    localStorage.setItem(SCHEDULER_ACTIVE_KEY, 'true');
    console.log('Daily news fetch scheduled for 6:00 AM');
  }

  /**
   * Calculates the time until the next 6:00 AM and schedules the fetch
   */
  private static scheduleNextRun(fetchCallback: () => Promise<any>): void {
    const now = new Date();
    const nextRun = new Date(now);
    
    // Set time to 6:00 AM
    nextRun.setHours(6, 0, 0, 0);
    
    // If it's already past 6:00 AM, schedule for tomorrow
    if (now >= nextRun) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime();
    console.log(`Next news fetch scheduled in ${Math.floor(timeUntilNextRun / (1000 * 60 * 60))} hours and ${Math.floor((timeUntilNextRun % (1000 * 60 * 60)) / (1000 * 60))} minutes`);
    
    setTimeout(() => {
      fetchCallback()
        .then(() => {
          console.log('Scheduled news fetch completed');
          // Schedule the next run
          this.scheduleNextRun(fetchCallback);
        })
        .catch(error => {
          console.error('Error in scheduled news fetch:', error);
          // Still schedule next run even if there was an error
          this.scheduleNextRun(fetchCallback);
        });
    }, timeUntilNextRun);
  }
}
