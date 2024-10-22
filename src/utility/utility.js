export const generateUnderscores = (length) => {
    let underscores = '';
    for (let i = 0; i < length; i++) {
      underscores += '_ ';
    }
    console.log(length,underscores);
    
    return underscores;
  };