import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import ActivityCard from "./ActivityCard";
import ActivityCardPlaceholder from "./ActivityCardPlaceholder";
import { Grid } from "semantic-ui-react";

interface Props {
    predicate: string;
}

export default observer(function ProfileEventsList({ predicate }: Props) {
    const { profileStore: { loadingActivities, userEvents, loadActivities } } = useStore();
    useEffect(() => {
        loadActivities(predicate);
    }, [loadActivities, predicate]);

    if (loadingActivities) return (
        <>
            <Grid container columns={4}>
                <Grid.Column className="four wide">
                    <ActivityCardPlaceholder />
                </Grid.Column>
                <Grid.Column className="four wide">
                    <ActivityCardPlaceholder />
                </Grid.Column>
                <Grid.Column className="four wide">
                    <ActivityCardPlaceholder />
                </Grid.Column>
                <Grid.Column className="four wide">
                    <ActivityCardPlaceholder />
                </Grid.Column>
            </Grid>
        </>
    )

    return (
        <>
            <Grid container columns={4}>
                {userEvents.map(e => (
                    <Grid.Column className="four wide">
                        <ActivityCard key={e.id} activity={e} />
                    </Grid.Column>
                ))}
            </Grid>
        </>
    );
})