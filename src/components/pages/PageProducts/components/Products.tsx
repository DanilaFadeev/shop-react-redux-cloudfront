import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import Drawer from '@material-ui/core/Drawer';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Pagination from '@material-ui/lab/Pagination';
import {makeStyles} from '@material-ui/core/styles';
import {Product} from "models/Product";
import {Stock} from "models/Stock";
import {formatAsPrice} from "utils/utils";
import AddProductToCart from "components/AddProductToCart/AddProductToCart";

import API_PATHS from "constants/apiPaths";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    height: '100%',
    cursor: 'pointer'
  },
  cardLabel: {
    top: 10,
    right: -25,
    padding: '7px 50px',
    position: 'absolute',
    transform: 'rotate(35deg)',
    background: theme.palette.primary.main,
    color: '#fff'
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
    width: '40%',
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
  },
  mb10: {
    marginBottom: 10
  }
}));

export default function Products() {
  const classes = useStyles();

  const productsPerPage = 12;

  const [product, setProduct] = useState<Product & Stock | null>(null);
  const [products, setProducts] = useState<(Product & Stock)[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    axios.get(API_PATHS.product)
      .then(({ data }) => {
        const paginationPages = Math.ceil(data.length / productsPerPage);

        setProducts(data);
        setTotalPages(paginationPages);
        console.log(data);
      });
  }, []);

  const onProductSelect = (productId: string) => {
    axios.get(`${API_PATHS.product}/${productId}`)
      .then(res => {
        setProduct(res.data);
        setDetailsOpen(true);
      });
  };

  const displayArtists = (artists: string[]): string => {
    const label = artists.join(', ');
    return label.length > 60 ? `${label.slice(0, 60)}...` : label;
  }

  return (
    <>
      <Grid container spacing={4}>
        {products
          .slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
          .map((product, index: number) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className={classes.root} onClick={() => onProductSelect(product.id)}>
              <div className={classes.details}>
                <div className={classes.cardLabel}>{product.count} left</div>
                <CardContent className={classes.content}>
                  <Typography component="h5" variant="h5">
                    {product.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {displayArtists(product.artists)}
                  </Typography>
                </CardContent>
                <div className={classes.controls}>
                  <Typography>
                    {formatAsPrice(product.price)}
                  </Typography> 
                  {product.count >= 1 && (<AddProductToCart product={product} />)}
                </div>
              </div>
              <CardMedia
                className={classes.cover}
                image={product.coveruri}
                title="Live from space album cover"
              />
            </Card>
          </Grid>
        ))}
        <Drawer anchor={'right'} open={detailsOpen} onClose={() => setDetailsOpen(false)}>
          {product && (<Grid className={classes.productContainer} container>
            <div>
              <div className={classes.mb10}>
                <Typography variant="h4" gutterBottom>
                  {product.title}
                </Typography>
              </div>
              <div className={classes.mb10}>
                <Typography variant="subtitle1" color="textSecondary">
                  {product.artists.join(', ')}
                </Typography>
              </div>
              <div className={classes.mb10}>
                <Chip label={product.genre} variant="outlined" />
                <Chip label={product.type} variant="outlined" />
              </div>
              <div className={classes.mb10}>
                <img src={product.coveruri} alt={product.title} />
              </div>
              <div className={classes.mb10}>{product.lyrics}</div>
              <div className={classes.mb10}>{product.releaseDate}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item style={{ flex: 2 }}>
                <Typography>
                  {formatAsPrice(product.price)} ({product.count} left)
                </Typography>
              </Grid>
              {product.count >= 1 && (
                <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                  <AddProductToCart product={product} />
                </div>
              )}
            </div>
          </Grid>)}        
        </Drawer>
      </Grid>
      <Pagination count={totalPages} size="large" onChange={(_, page) => setCurrentPage(page)} />
    </>
  );
}
