fetch("/api/carts/getcartfromuser")
  .then((response) => response.json)
  .then((data) => {
    
  })
  .catch((error) => {
    console.error(error);
  });
