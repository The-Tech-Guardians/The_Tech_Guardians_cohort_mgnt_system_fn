
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export 
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      console.log(`🔄 Attempt ${i + 1}/${maxRetries + 1}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response;
      
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.warn(`⚠️ Attempt ${i + 1} failed:`, lastError.message);
 
      if (i === maxRetries) {
        throw error;
      }
      
      const waitTime = (i + 1) * 15000; 
      console.log(`⏳ Waiting ${waitTime/1000}s before retry...`);
      await sleep(waitTime);
    }
  }
  
  throw lastError || new Error('Request failed');
}