/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { withRouter, Redirect } from 'react-router-dom';
import { Media, Jumbotron, Container, InputGroup, Button } from 'reactstrap';
import allActions from '../redux/actions';
import EditForm from '../components/EditForm';
import SubMenuInputGroupButtonDropdown from '../components/edit-dropdowns/SubMenuInputGroupButtonDropdown';

const Edit = (props) => {
  const { roles } = useSelector((state) => state.auth.user);
  const { selectedEdit } = useSelector((state) => state.data);
  const { subMenus } = selectedEdit;
  const { message } = useSelector((state) => state.message);
  const [successful, setSuccessful] = useState(false);
  const dispatch = useDispatch();

  const [subMenuSelection, setSubMenuSelection] = useState(null);

  const validationSchema = Yup.object().shape({
    edit: Yup.string().required('Classification is required'),
    // {selectedEdit.hasSubMenu && username : Yup.string().required('Username is required'),
    // .min(6, 'Username must be at least 6 characters')
    // .max(20, 'Username must not exceed 20 characters'),
    // email: Yup.string().required('Email is required').email('Email is invalid'),
    // password: Yup.string()
    //   .required('Password is required')
    //   .min(6, 'Password must be at least 6 characters')
    //   .max(40, 'Password must not exceed 40 characters'),
    // confirmPassword: Yup.string()
    //   .required('Confirm Password is required')
    //   .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    // acceptTerms: Yup.bool().oneOf([true], 'Accept Terms is required'),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data) => {
    if (Array.from(errors).length === 0) {
      dispatch(allActions.auth.register(data));
      //   .then(() => {
      //     // console.log(res.data);
      //     // if (res.data.roles) {
      //     props.history.push('/dashboard');
      //     // }
      //   })
      //   .catch(() => {
      //     setIsLoading(false);
      //   });
      console.log(data);
      setSuccessful(true);
    } else {
      setSuccessful(false);
    }
  };

  console.log(selectedEdit);
  return roles.includes('ROLE_ADMIN') && selectedEdit.name !== undefined ? (
    <Jumbotron>
      <div className="edit-content">
        <Container>
          <Media body>
            <h4 className="lead">Editing:</h4>
            <Media heading>
              <div style={{ display: 'flex' }}>
                <p className="display-4">{selectedEdit.name.toUpperCase()}</p>
                <Button
                  className="reset-btn-edit"
                  type="button"
                  color="warning"
                  onClick={() => reset()}
                >
                  <span>Reset</span>
                </Button>
                <Button className="danger-btn-edit" outline color="danger">
                  Delete
                </Button>
              </div>
              <hr className="my-2" />
            </Media>
            <Container fluid style={{ padding: '2rem' }}>
              <InputGroup>
                {Array.from(Object.keys(subMenus)).length !== 0 && (
                  <SubMenuInputGroupButtonDropdown
                    setSubMenuSelection={setSubMenuSelection}
                    subMenuSelection={subMenuSelection}
                    selectedEdit={selectedEdit}
                    subMenus={subMenus}
                  />
                )}
              </InputGroup>

              <Media body>
                <Container fluid style={{ padding: '2rem' }}>
                  <EditForm
                    successful={successful}
                    message={message}
                    onSubmit={onSubmit}
                    errors={errors}
                    register={register}
                    handleSubmit={handleSubmit}
                    reset={reset}
                  />
                </Container>
              </Media>
            </Container>
          </Media>
        </Container>
      </div>
    </Jumbotron>
  ) : (
    <Redirect
      to={{ pathname: '/dashboard', state: { from: props.history.location } }}
    />
  );
};

export default withRouter(Edit);
