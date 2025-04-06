export class Logger {
  private static instance: Logger
  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  info(message: string, data?: any): void {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data) : '')
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error) : '')
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data ? JSON.stringify(data) : '')
  }

  debug(message: string, data?: any): void {
    console.debug(`[DEBUG] ${message}`, data ? JSON.stringify(data) : '')
  }

  // 性能监控日志
  performance(operation: string, duration: number): void {
    this.info(`Performance: ${operation} took ${duration}ms`)
  }

  // API 请求日志
  apiRequest(method: string, path: string, status: number, duration: number): void {
    this.info(`API Request: ${method} ${path}`, {
      status,
      duration: `${duration}ms`
    })
  }
} 