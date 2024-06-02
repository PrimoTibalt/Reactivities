import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnecton: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity?.id == activityId) {
            this.hubConnecton = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnecton.start().catch(error => console.log('Error establishing the connecton: ', error));

            this.hubConnecton.on('LoadComments', (comments: ChatComment[]) => {
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments
                });
            });

            this.hubConnecton.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment)});
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnecton?.stop().catch(error => console.log('Error stopping the connecton: ', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: {body: string, activityId?: string}) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnecton?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }
}