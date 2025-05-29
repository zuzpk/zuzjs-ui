import { CancelTokenSource } from "axios";
import { dynamic, getCancelToken, uuid, withPost } from "..";

export enum Status {
    Error = -1,
    Idle = 0,
    FetchingServer = 1,
    Uploading = 2,
    Saving = 3,
}

export interface QueItem {
    ID: string,
    file: File,
    dir: string,
    remote: false,
    progress: number,
    speed: number,
    eta: number,
    bytes: number,
    status: Status,
    server?: Server | null,
}

export type Server = {
    ID: string,
    uri: string,
    token: string,
    rmf: string | null
}

export type Uploadify = {
    que: QueItem[],
    index: number,
    speed: number,
    stamp: number | null,
    token: string | null,
    status: Status,
    cancelToken?: CancelTokenSource | null
}

export interface Uploader {
    apiUrl: string,
    onChange?: (file: QueItem | null) => void,
    onQueFinished?: () => void,
}

const useUploader = (conf: Uploader) => {

    const { 
        apiUrl,
        onChange, onQueFinished } = conf;

    const self : Uploadify = {
        que: [],
        index: -1,
        speed: 0,
        stamp: null,
        token: null,
        status: Status.Idle
    }

    const sync = () => onChange?.(currentFile())

    const importFile = () => {}

    const uploadFile = () => {
        self.stamp = Date.now()
        const file = currentFile()
        const formData = new FormData()
        formData.append("ID", file.ID);
		formData.append("dir", file.dir);
		formData.append("server", file.server!.ID);
		formData.append("token", file.server!.token);
		formData.append('file', file.file);
		formData.append('fs', file.file.size.toString());
		self.cancelToken = getCancelToken()

        withPost(
            `${self.que[self.index].server!.uri}/receive`,
            formData,
            86400,
            (ev) => {
                console.log(ev)
            }
        )
        .catch(err => {
            self.que[self.index].status = Status.Error
            self.status = Status.Error
            sync()
            Que()
        })
    }

    const getServer = (force: boolean) => {
        
        self.que[self.index].status = Status.FetchingServer
        sync()

        withPost<{
            kind: string,
            server: Server,
        }>(
            `${apiUrl}get_server`,
            { size: currentFile().file.size }
        )
        .then((resp) => {
            self.que[self.index].server = resp.server;
            self.que[self.index].status = Status.Uploading;
            sync()
            uploadFile();
        })
        .catch((err) => {
            self.que[self.index].status = Status.Error
            self.status = Status.Error
            sync()
            Que()
        })
    }

    const currentFile = () : QueItem => self.que[self.index]

    const Que = () => {
        if( 
            self.status == Status.Idle && 
            (self.que.length - 1) > self.index 
        ){

            self.status = Status.Uploading
            self.index++
            self.que[self.index].status = Status.Uploading
            sync()
            if ( self.que[self.index].remote ) importFile()
            else getServer(true);
            
        }
        else onQueFinished?.()
    }

    const addToQue = (f: dynamic) => {
        self.que.push({
            ID: uuid(),
            file: f.file as File,
            dir: f.dir,
            remote: f.remote,
            progress: 0,
            speed: 0,
            eta: 0,
            bytes: 0,
            status: Status.Idle,
            server: null
        });
        Que()
    }

    return {
        addToQue,
    };

}

export default useUploader;