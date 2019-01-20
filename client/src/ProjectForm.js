// ProjectForm.js
import React from 'react';
// import Dialog from 'MyImaginaryDialogComponent'; // this isn't a real package, just imagine it exists.
import { Formik } from 'formik';

const ProjectForm = ({ user, updateUser, onClose }) => {
    return (
        <ProjectForm onClose={onClose}>
            <h1>Edit User</h1>
            <Formik
                initialValues={user /** { email, social } */}
                /* onSubmit={(values, actions) => {
                    MyImaginaryRestApiCall(user.id, values).then(
                        updatedUser => {
                            actions.setSubmitting(false);
                            updateUser(updatedUser);
                            onClose();
                        },
                        error => {
                            actions.setSubmitting(false);
                            actions.setErrors(transformMyRestApiErrorsToAnObject(error));
                            actions.setStatus({ msg: 'Set some arbitrary status or data' });
                        }
                    );
                }}  */
                render={({
                             values,
                             errors,
                             status,
                             touched,
                             handleBlur,
                             handleChange,
                             handleSubmit,
                             isSubmitting,
                         }) => (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                        {errors.email && touched.email && <div>{errors.email}</div>}
                        <input
                            type="text"
                            name="social.facebook"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.social.facebook}
                        />
                        {errors.social &&
                        errors.social.facebook &&
                        touched.facebook && <div>{errors.social.facebook}</div>}
                        <input
                            type="text"
                            name="social.twitter"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.social.twitter}
                        />
                        {errors.social &&
                        errors.social.twitter &&
                        touched.twitter && <div>{errors.social.twitter}</div>}
                        {status && status.msg && <div>{status.msg}</div>}
                        <button type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                    </form>
                )}
            />
        </ProjectForm>
    );
};

export default ProjectForm;