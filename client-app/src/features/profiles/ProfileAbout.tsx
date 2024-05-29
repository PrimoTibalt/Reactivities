import { Button, Grid, Header, Tab } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useState } from "react";
import { useStore } from "../../app/stores/store";
import ProfileEdit from "./ProfileEdit";
import { observer } from "mobx-react-lite";

interface Props {
    profile: Profile
}

class PageState {
    currentState: 'view' | 'edit' = 'view';
}

export default observer(function ProfileAbout({ profile }: Props) {
    const isUserProfile = useStore().userStore.user?.username === profile.username;
    const [state, setState] = useState(new PageState());

    function handleClick() {
        const newState = new PageState();
        if (state.currentState === 'view') {
            newState.currentState = 'edit';
        } else {
            newState.currentState = 'view';
        }

        setState(newState);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        icon='user'
                        floated='left'
                        content='About Content' />
                    <Button
                        floated='right'
                        disabled={!isUserProfile}
                        onClick={handleClick}
                        content={state.currentState === 'view' ? 'Edit Profile' : 'Cancel'} />
                </Grid.Column>
                <Grid.Column width={16}>
                    {state.currentState === 'view' && <span className="bioTextArea">{profile.bio}</span>}
                    {state.currentState === 'edit' && <ProfileEdit handleClick={handleClick} />}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})