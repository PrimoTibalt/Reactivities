import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import AcitivityDetailedHeader from "./ActivityDetailedHeader";
import AcitivityDetailedInfo from "./ActivityDetailedInfo";
import AcitivityDetailedChat from "./ActivityDetailedChat";
import AcitivityDetailedSidebar from "./ActivityDetailedSidebar";


export default observer( function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();

    useEffect(() => {
        if (id) loadActivity(id);
    }, [id, loadActivity]);

    if (loadingInitial || !activity) return <LoadingComponent />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <AcitivityDetailedHeader activity={activity} />
                <AcitivityDetailedInfo activity={activity}  />
                <AcitivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={5}>
                <AcitivityDetailedSidebar />
            </Grid.Column>
        </Grid>
    )
})