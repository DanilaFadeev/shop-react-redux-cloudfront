import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import {makeStyles} from '@material-ui/core/styles';
import {Product} from "models/Product";
import {formatAsPrice} from "utils/utils";
import AddProductToCart from "components/AddProductToCart/AddProductToCart";

import API_PATHS from "constants/apiPaths";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 150,
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  productContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '40vw',
    height: '100%',
    padding: 20
  }
}));

export default function Products() {
  const classes = useStyles();

  const [product, setProduct] = useState<Product>();
  const [products, setProducts] = useState<Product[]>([]);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  useEffect(() => {
    axios.get(API_PATHS.product)
      .then(res => setProducts(res.data));
  }, []);

  const onProductSelect = (productId: string) => {
    axios.get(`${API_PATHS.product}/${productId}`)
      .then(res => {
        setProduct(res.data);
        setDetailsOpen(true);
      });
  };

  return (
    <Grid container spacing={4}>
      {products.map((product: Product, index: number) => (
        <Grid item key={product.id} xs={12} sm={6} lg={4}>
           <Card className={classes.root} onClick={() => onProductSelect(product.id)}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  {product.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {product.artists.join(', ')}
                </Typography>
              </CardContent>
              <div className={classes.controls}>
                <Typography>
                  {formatAsPrice(product.price)}
                </Typography> 
                <AddProductToCart product={product} />
              </div>
            </div>
            <CardMedia
              className={classes.cover}
              image={product.coverUri}
              title="Live from space album cover"
            />
          </Card>
        </Grid>
      ))}
      <Drawer anchor={'right'} open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        {product && (<Grid className={classes.productContainer} container>
          <Grid container>
            <Grid item>
              <Typography variant="h4" gutterBottom>
                {product.title}
              </Typography>
            </Grid>
            <Grid item>
              {product.artists.join(', ')}
            </Grid>
            <Grid item>
              <Chip label={product.genre} variant="outlined" />
            </Grid>
            <Grid item>
              <Chip label={product.type} variant="outlined" />
            </Grid>
            <Grid item><img src={product.coverUri} alt={product.title} /></Grid>
            <Grid item>{product.lyrics}</Grid>
            <Grid item>{product.releaseDate}</Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid item style={{ flex: 2 }}>
              <Typography>
                {formatAsPrice(product.price)}
              </Typography>
            </Grid>
            <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
              <AddProductToCart product={product} />
            </div>
          </div>
        </Grid>)}        
      </Drawer>
    </Grid>
  );
}
