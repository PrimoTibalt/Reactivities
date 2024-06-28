import { observer } from "mobx-react-lite";
import { Grid, Header, Tab } from "semantic-ui-react";
import ProfileEventsList from "./ProfileEventsList";
import { useState } from "react";

export default observer(function ProfileEvents() {
    const panes = [
        { menuItem: 'Future Events', pane: { key: "future" } },
        { menuItem: 'Past Events', pane: { key: "past" } },
        { menuItem: 'Hosting', pane: { key: "hosting" } }
    ];

    const [tab, setTab] = useState('future');

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        icon='calendar'
                        floated='left'
                        content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        menuPosition="left"
                        panes={panes}
                        onTabChange={(_, data) => setTab(panes![data.activeIndex as number].pane.key)}
                    />
                    <br />
                    <ProfileEventsList predicate={tab} />
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})