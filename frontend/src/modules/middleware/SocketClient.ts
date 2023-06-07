import io from 'socket.io-client';

export class SocketClient {
    socket?: SocketIOClient.Socket | null;

    connect(refreshToken: string) {
        this.socket = io.connect(
            `https://lasocialnetwork.herokuapp.com/`
            // process.env.NODE_ENV === 'development' ? `http://localhost:3030/` : `https://lasocialnetwork.herokuapp.com/`
            , {
                transports: ['websocket'],
                // rejectUnauthorized: false,
                // secure: true
            });

        return new Promise((resolve, reject) => {
            this.socket?.on('connect_error', (error: any) => reject(error));
            this.socket?.emit('join', {refreshToken}, (err?: string) => {
                if (err) reject(new Error(err))
                else resolve()
            });
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            console.log('Disconnecting socket...');
            try {
                this.socket?.disconnect();
                this.socket = null;
                resolve();
            } catch (err) {
                console.log('some error, probably cause socket not connected', err);
                reject(err)
            }
        });
    }

    emit(event: any, data: any) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.');

            return this.socket.emit(event, data, (response: any) => {
                // Response is the optional callback that you can use with socket.io in every request. See 1 above.
                if (response?.error) {
                    console.error(response.error);
                    return reject(response.error);
                }
                return resolve();
            });
        });
    }

    on(event: any, func: any) {
        // No promise is needed here, but we're expecting one in the middleware.
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.');

            this.socket.on(event, func);
            resolve();
        });
    }
}