/**
 * Project:  valueinfinity-mvp
 * File:     /client/src/components/dashboard/DashboardStyles.js
 * Desc:     Commond styles for project dashboards.
 * Created:  2019-10-08
 * Author:   Brad Kaufman
 * -----
 * Modified: 2019-10-06
 * Editor:   Brad Kaufman
 */
export const styles = theme => ({
  chip: {
    margin: 2,
  },
  filterSelect: {
    alignItems: "flex-end"
  },
  filters: {
    alignItems: "flex-end"
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  card: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    maxWidth: 1200,
    color: theme.palette.text.secondary
  },
  paper: {
    padding: theme.spacing.unit * 3,
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 170,
    maxWidth: 450,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "15%"
  },
  narrowColumn: {
    flexBasis: "5%"
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    }
  }
});
