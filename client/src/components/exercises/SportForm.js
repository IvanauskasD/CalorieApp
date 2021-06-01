import React, { useRef, Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchSport, getSports, getSportById } from '../../actions/sport'
import { getCurrentDietProfile } from '../../actions/dietprofile';

import AddExercise from './AddExercise'



import { makeStyles, useTheme } from '@material-ui/core/styles';

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


const initialState = {
    name: ''
  };

const SportForm = ({
    getCurrentDietProfile,
    searchSport,
    getSports,
    getSportById,
    sport: {sport },
    props,
}) => {
    const [formData, setFormData] = useState(initialState);
    useEffect(() => {
      getSportById();
    }, [getSportById]);

  let { name } = formData;

  const onSubmit = e => {
    e.preventDefault();
    searchSport(formData, sport ? true : false);
   // console.log(formData)
  };

  let btnRef = useRef();
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  let emptyRows = 0
  if(sport !== null)
  emptyRows = rowsPerPage - Math.min(rowsPerPage, sport.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


  let url = new URL(window.location.href)
  let paramz = new URLSearchParams(url.search);
  let datesF = paramz.get('date')

  return (
    <Fragment>
      <h1 className="large text-primary">Add Exercise To Diary</h1>

      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="Type sport name here"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>

        <input value="Search Exercises" type="submit" className="btn btn-primary my-1" />
      </form>

      {sport !== null ? (
<div>
                <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="custom pagination table">
        <TableBody>
        <TableRow key='0'>
              <TableCell component="th" scope="row">
                Exercise Name
              </TableCell>
              <TableCell style={{ width: 180 }} align="left">
                Calories Burned
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
              </TableCell>
            </TableRow>
          {(rowsPerPage > 0
            ? sport.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : sport
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 60 }} align="left">
                {row.caloriesBurned}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                <AddExercise props={row} diena={datesF} />
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
              count={sport.length}
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

</div>






      ) : (

        <Link to={`/exercises?date=`} className='btn btn-danger'>Go Back</Link>

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


SportForm.propTypes = {
    sport: PropTypes.object.isRequired,
    getCurrentDietProfile: PropTypes.func.isRequired,
    getSportById: PropTypes.func.isRequired,
    searchSport: PropTypes.func.isRequired,
    getSports: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    sport: state.sport,
});

export default connect(mapStateToProps, {getSports, getSportById, searchSport, getCurrentDietProfile })(
  SportForm
);