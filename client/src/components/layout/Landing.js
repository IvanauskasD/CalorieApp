import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const Landing = () => {
    return (
        <section className="landing">
            <div className="dark-overlay">
                <div className="landing-inner">
                    <h1 className="x-large">Calorie Counter</h1>
                    <p className="lead">tedaf aafafasf afasdfas adsdsa</p>
                    <div className="buttons">
                        <Link to='/register' className="btn btn-primary">Sign Up</Link>
                        <Link to='/login' className="btn btn-light">Login</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Landing