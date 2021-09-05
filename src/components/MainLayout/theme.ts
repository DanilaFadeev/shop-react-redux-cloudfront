import { createTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import pink from '@material-ui/core/colors/pink';

export default createTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: pink[500],
    },
  },
});
