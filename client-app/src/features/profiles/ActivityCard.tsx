import { observer } from "mobx-react-lite";
import { IUserActivity } from "../../app/models/activity";
import { Image, Card } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface Props {
    activity: IUserActivity
}

export default observer(function ActivityCard({ activity }: Props) {
    return (
        <Card as={Link} to={`/activities/${activity.id}`}>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content textAlign="center">
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    {format(activity.date!, 'do MMM')}
                </Card.Meta>
                <Card.Meta>
                    {format(activity.date!, 'h:mm a')}
                </Card.Meta>
            </Card.Content>
        </Card>
    )
})