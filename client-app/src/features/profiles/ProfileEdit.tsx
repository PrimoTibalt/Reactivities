import { Formik, Form } from "formik";
import { Button, Header, Segment } from "semantic-ui-react";
import * as Yup from 'yup';
import { useStore } from "../../app/stores/store";
import { Profile } from "../../app/models/profile";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { observer } from "mobx-react-lite";

interface Props {
    handleClick: () => void;
}

export default observer(function ProfileEdit({handleClick}: Props) {
    const {profileStore:{profile, updateProfile, loading}} = useStore();
    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required')
    });

    async function handleSubmit(data: Profile) {
        await updateProfile({displayName: data.displayName, bio: data.bio} as Profile);
        handleClick();
    }

    if (profile !== null) {
        return (
            <Segment clearing>
                <Header content='Edit profile' />
                <Formik
                    validationSchema={validationSchema}
                    enableReinitialize
                    initialValues={profile}
                    onSubmit={handleSubmit}>
                    {({handleSubmit, isValid, dirty}) => (
                        <Form className="ui form" onSubmit={handleSubmit}>
                            <MyTextInput name='displayName' placeholder='DisplayName' />
                            <MyTextArea className="bioTextArea" rows={4} name='bio' placeholder='Bio' />
                            <Button 
                                content='Update'
                                positive floated='right'
                                loading={loading}
                                disabled={!isValid || !dirty}
                                type='submit' />
                        </Form>
                    )}
                </Formik>
            </Segment>
        );
    }
        

    return null;
})