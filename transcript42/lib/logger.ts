import { supabaseAdmin } from './supabase';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
    level: LogLevel;
    message: string;
    metadata?: any;
    service?: string;
}

class Logger {
    private service: string = 'transcript42-server';

    async log(level: LogLevel, message: string, metadata: any = {}) {
        // Output to console as well
        const timestamp = new Date().toISOString();
        const consoleMsg = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        if (level === 'error') {
            console.error(consoleMsg, metadata);
        } else if (level === 'warn') {
            console.warn(consoleMsg, metadata);
        } else {
            console.log(consoleMsg, metadata);
        }

        // Push to Supabase optionally
        if (supabaseAdmin) {
            try {
                await supabaseAdmin.from('logs').insert({
                    level,
                    message,
                    metadata,
                    service: this.service
                });
            } catch (err) {
                console.error('Failed to push log to Supabase:', err);
            }
        }
    }

    info(message: string, metadata?: any) {
        return this.log('info', message, metadata);
    }

    warn(message: string, metadata?: any) {
        return this.log('warn', message, metadata);
    }

    error(message: string, metadata?: any) {
        return this.log('error', message, metadata);
    }

    debug(message: string, metadata?: any) {
        return this.log('debug', message, metadata);
    }
}

export const logger = new Logger();
