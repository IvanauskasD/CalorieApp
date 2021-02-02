import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFood } from '../../actions/food';

const initialState = {
    name: '',
    calories: '',
    servingSize: ''
};

const FoodForm = ({
    food: { food, loading },
    createFood,
    history
}) => {
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (!food)
            if (!loading && food) {
                const foodData = { ...initialState };
                for (const key in food) {
                    if (key in foodData) foodData[key] = food[key];
                }
                setFormData(foodData);
            }
    }, [loading, food]);

    const {
        name,
        calories,
        servingSize
    } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        createFood(formData, history, food ? true : false);
    };
    return (
        <Fragment>
            <h1 className="large text-primary">Edit Food Card</h1>
            <p className="lead">
                <i className="fas fa-user" /> Add some changes to food card
      </p>
            <small>* = required field</small>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="name"
                        name="name"
                        value={name}
                        onChange={onChange}
                    />
                    <small className="form-text">
                        Describe your work ethic
          </small>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="calories"
                        name="calories"
                        value={calories}
                        onChange={onChange}
                    />
                    <small className="form-text">
                        Country and City
          </small>
                </div>
                <div className="form-group">
                    <input
                    type="text"
                        placeholder="A short servingSize of yourself"
                        name="servingSize"
                        value={servingSize}
                        onChange={onChange}
                    />
                    <small className="form-text">Tell us a little about yourself</small>
                </div>

                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">
                    Go Back
        </Link>
            </form>
        </Fragment>
    );
};

FoodForm.propTypes = {
    createFood: PropTypes.func.isRequired,
    food: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    food: state.food
});

export default connect(mapStateToProps, { createFood, })(
    FoodForm
);