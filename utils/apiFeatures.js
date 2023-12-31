class APIFeatures{
    constructor(query, queryString){
        this.query= query;
        this.queryString=queryString;
    }

    filter(){
        const queryObj={...this.queryString};
        const excludedFields=['page','sort','limit','fields'];
        excludedFields.forEach(el=> delete queryObj[el]);


        // 2) Advanced Filtering

        let queryStr=JSON.stringify(queryObj);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr)) 

        return this
         
        //console.log(JSON.parse(queryStr))


        // gte,gt,lte,lt
        //console.log(req.query, queryObj);

        //this.query.find(JSON.parse(queryStr))
        // let query= Tour.find(JSON.parse(queryStr))

    }

    sort(){
        if(this.queryString.sort){
            const sortBy= this.queryString.sort.split(',').join(' ');
            this.query= this.query.sort(sortBy);
            //console.log(sortBy)
            //query=query.sort(sortBy)

            //sort('price ratingAverage')
        } else{
            this.query=this.query.sort('-createdAt');
        }

        return this;

    }
    limitFields(){
        if (this.queryString.fields){
            const fields=this.queryString.fields.split(',').join(' ');
            this.query= this.query.select(fields)
        }else{

            this.query= this.query.select('-__v');
        }

        return this;
    }

    paginate(){
        const page=this.queryString.page*1 || 1
        const limit = this.queryString.limit*1 || 100;

        // if page=1 and limit=3
        // (1-1)*3
        // 0

        const skip = (page-1)*limit



        //PAGE 2 LIMIT 10  
        this.query= this.query.skip(skip).limit(limit)

        // if(this.queryString.page){
        //     const numTours= await Tour.countDocuments();
        //     if(skip>=numTours) throw new Error('This page does not exist')
        // }

        return this
    }
    
}

module.exports= APIFeatures;