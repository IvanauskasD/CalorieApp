import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createSport } from '../../actions/sport';
import Spinner from '../layout/Spinner';



const SportItem = ({ sport, createSport }) => {

    const initialState = {
        name: '',
        caloriesBurned: ''
    };
    const [formData, setFormData] = useState(initialState);


    const onSubmit = e => {
        e.preventDefault();
        formData.votedOnBy = localStorage.getItem('dietprofile')
        createSport(formData, sport ? true : false);
    };

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    let { name, caloriesBurned } = formData;


    return (
        <Fragment>

            <form
                className="form"
                onSubmit={onSubmit}
            >

                <div className="form-group">
                    <label>Exercise Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
                    <br />
                    <label>Calories Burned:</label>
                    <input
                        type="text"
                        name="caloriesBurned"
                        value={caloriesBurned}
                        onChange={onChange}
                        required
                    />
                    <br />
                </div>

                <input type="submit" className="btn btn-primary my-1" />

                <Link className="btn btn-light my-1" to="/dashboard">
                    Go Back
            </Link>
            </form>

        </Fragment>
    );
};

SportItem.propTypes = {
    createSport: PropTypes.func.isRequired,
    sport: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    sport: state.sport,
    auth: state.auth
});

export default connect(mapStateToProps, { createSport })(SportItem);