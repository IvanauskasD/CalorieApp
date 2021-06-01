import React, { useRef, Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { getNotApprovedFoods, approveFood, disapproveFood } from '../../actions/food'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { getCurrentDietProfile } from '../../actions/dietprofile';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
}));

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

const FoodSuggestionTable = ({
    getNotApprovedFoods,
    getCurrentDietProfile,
    dietprofile,
    approveFood,
    food,
    disapproveFood
}) => {

  const test = {
    user: ''
  }

    const [loaded, setLoaded] = useState(false);
    const [loaded1, setLoaded1] = useState(false);

    const [form, setForm] = useState(test);

    let btnRef = useRef();
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    let emptyRows = 0
    if(food.food !== null)
    emptyRows = rowsPerPage - Math.min(rowsPerPage, food.food.length - page * rowsPerPage);
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    useEffect(() => {
      getCurrentDietProfile()
      if(!dietprofile){ 
        setLoaded1(true)
      } else {
        setLoaded1(false)
      }
        getNotApprovedFoods();
        if (food !== null) {
            setLoaded(true)
        } else {
            setLoaded(false)
        }
    }, [getCurrentDietProfile, loaded, loaded1]);

   
    

    const onSubmit = (row) => {
      form.user = localStorage.getItem('dietprofile')
      approveFood(row, form)
      setLoaded(false)
    };


    const onSubmitD = (row) => {
      form.user = localStorage.getItem('dietprofile')
      disapproveFood(row, form)
      setLoaded(false)
    };

    return (

        <Fragment>
            <div>
                {loaded ? <h1>Approve/Do Not Approve These Foods:</h1> : ''}
            </div>
            {Array.isArray(food.food) && food.food !== null ? (
                <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
        <TableRow key='0'>
              <TableCell component="th" scope="row">
                Food Name
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Calories
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Carbs
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Protein
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Fat
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              </TableCell>
            </TableRow>
          {(rowsPerPage > 0
            ? food.food.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : food.food
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.calories}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.carbs}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.protein}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.fat}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                <button ref={btnRef} onClick={() => {onSubmit(row._id)}} className='btn btn-success'>Approve</button>
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                <button ref={btnRef} onClick={() => {onSubmitD(row._id)}} className='btn btn-danger'>Disapprove</button>
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                Approved by {row.approved} people
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={8}
              count={food.food.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
            ) : (
                <div></div>
            )}
        </Fragment>
    );
}


function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

FoodSuggestionTable.propTypes = {
    food: PropTypes.object.isRequired,
    dietprofile: PropTypes.object.isRequired,
    getNotApprovedFoods: PropTypes.func.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    approveFood: PropTypes.func.isRequired,
    disapproveFood: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    food: state.food,
    dietprofile: state.dietprofile
});

export default connect(mapStateToProps, {disapproveFood, getCurrentDietProfile, approveFood, getNotApprovedFoods })(FoodSuggestionTable);