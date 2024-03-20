import { Button, Form, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';
import { Activity } from "../../../app/models/activity";

export default observer(function ActivityForm() {
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadingInitial,
        loadActivity} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();
    const initialState: Activity = {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    };
    const [activity, setActivity] = useState(initialState);

    useEffect(function() {
        if (id) {
            loadActivity(id).then((activity) => setActivity(activity!));
        }
    }, [id, loadActivity]);

    

    function handleSubmit() {
        let promise: Promise<void>;
        if (!activity.id) {
            activity.id = uuid();
            promise = createActivity(activity);
        } else {
            promise = updateActivity(activity);
        }
        promise.then(() => navigate(`/activities/${activity.id}`));
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value})
    }
    
    if (loadingInitial) return <LoadingComponent content='Loading an activity...' />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.Input placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type="date" value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={loading} floated="right" positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated="right" type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})