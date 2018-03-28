//-------------------------------------------------------------------------
/**
 * Make terrain from iteration
 * @param n
 * @param minX
 * @param maxX
 * @param minY
 * @param maxY
 * @param vertexArray
 * @param faceArray
 * @param normalArray
 * @param max
 * @returns {number}
 */
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray, max)
{

    //make terrian vertices form iteration
    max = 0;
    var height = new Array(n+1);
    createHeightArray(height,n);
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {

           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(height[i][j]);//avrg(vertexArray, j)+Math.random()*.3);
           if(height[i][j] > max)
               max=height[i][j];

           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(0);
       }

    //make terrian faces from iteration
    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);

           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2 ;
       }

    //sets the terrian height to a sign wave
    //sinTerrian(vertexArray,n);

    //sets the normals of the new terrian
    normalArray = setNorms(faceArray, vertexArray, normalArray);

    return numT;
}

/**
 * Create a 2D array to store height of every vertex
 * @author Fanyin Ji
 * @param height This is the 2D array we are going to store height.
 * @param n The number of grid.
 */
function createHeightArray(height,n){
    for(var i = 0; i<= n; i++){
        height[i]=new Array(n+1);
        for(var j=0; j<=n; j++){
            height[i][j]=0.0;
        }
    }
    diamondSquare(height, 0, 0, n, 0, 0, n, n, n, 4,n);
    // Make the terrain smmother.
    for(var i = 0; i<= n; i++){
        for(var j=0; j<=n; j++){
            if(i==0 && j > 0 && j<n){
                height[i][j]=(height[i][j-1]+height[i][j+1]+height[i+1][j])/3
            }
            if(i==n && j > 0 && j<n){
                height[i][j]=(height[i][j-1]+height[i][j+1]+height[i-1][j])/3
            }
            if(j==0 && i > 0 && i<n){
                height[i][j]=(height[i][j+1]+height[i+1][j]+height[i-1][j])/3
            }
            if(j==n && i > 0 && i<n){
                height[i][j]=(height[i][j-1]+height[i+1][j]+height[i-1][j])/3
            }
            if(i!=0 && i!=n && j!=0 && j!=n){
                height[i][j]=(height[i][j+1] + height[i][j-1] + height[i+1][j] + height[i-1][j])/4
            }
            if(height[i][j] < 0.0)
                height[i][j]=0.0;
        }
    }
}

/**
 * Perform the Diamond-Square Algorithm with Diamond step
 * @author Fanyin Ji
 * @param height The 2D array that stored the height.
 * @param nw_x The x coordinate of vertex at north-west corner
 * @param nw_y The y coordinate of vertex at north-west corner
 * @param ne_x The x coordinate of vertex at north-east corner
 * @param ne_y The y coordinate of vertex at north-east corner
 * @param sw_x The x coordinate of vertex at south-west corner
 * @param sw_y The y coordinate of vertex at south-west corner
 * @param se_x The x coordinate of vertex at south-east corner
 * @param se_y The y coordinate of vertex at south-east corner
 * @param range To generate a random number to adjust the height.
 * @param n The size of the grid
 */

function diamondSquare(height, nw_x, nw_y, ne_x, ne_y, sw_x, sw_y, se_x, se_y, range,n){
    if(ne_x - nw_x == 1 || se_x - sw_x == 1 || sw_y - nw_y == 1 || se_y - ne_y ==1)
        return;
    if(range==4){
        height[nw_x][nw_y]=1;
        height[ne_x][ne_y]=1;
        height[sw_x][sw_y]=1;
        height[se_x][se_y]=1;
    }

    // Center coordinate
    var X = (ne_x-nw_x)/2 + nw_x;
    var Y = (sw_y - nw_y)/2 + nw_y;

    var rand = (Math.random()*2-1)*range;
    /*
     For each square in the array, midpoint height = avg four corner points + random value
     */
    height[X][Y] = (height[nw_x][nw_y] + height[ne_x][ne_y] + height[sw_x][sw_y] + height[se_x][se_y] + rand)/4;

    rand = (Math.random()*2-1)*range;

    height[X][nw_y] = (height[nw_x][nw_y] + height[ne_x][ne_y] + height[X][Y] + rand)/3;
    height[X][sw_y] = (height[sw_x][sw_y] + height[se_x][se_y] + height[X][Y] + rand)/3;
    height[nw_x][Y] = (height[nw_x][nw_y] + height[sw_x][sw_y] + height[X][Y] + rand)/3;
    height[ne_x][Y] = (height[ne_x][ne_y] + height[se_x][se_y] + height[X][Y] + rand)/3;
    // Scale the range
    range *= 0.8;

    // Recursion
    diamondSquare(height, nw_x, nw_y, X, nw_y, nw_x, Y, X, Y, range, n);
    diamondSquare(height, X, nw_y, ne_x, ne_y, X, Y, ne_x, Y, range, n);
    diamondSquare(height, nw_x, Y, X, Y, sw_x, sw_y, X, sw_y, range, n);
    diamondSquare(height, X, Y, ne_x, Y, X, sw_y, se_x, se_y, range, n);



}



//-------------------------------------------------------------------------

/**
 * sets the normals of the new terrian
 * @param faceArray
 * @param vertexArray
 * @param normalArray
 * @returns {normarlArray}
 */
function setNorms(faceArray, vertexArray, normalArray)
{
    for(var i=0; i<faceArray.length;i+=3)
    {
        //find the face normal
        var vertex1 = vec3.fromValues(vertexArray[faceArray[i]*3],vertexArray[faceArray[i]*3+1],vertexArray[faceArray[i]*3+2]);

        var vertex2 = vec3.fromValues(vertexArray[faceArray[i+1]*3],vertexArray[faceArray[i+1]*3+1],vertexArray[faceArray[i+1]*3+2]);

        var vertex3 = vec3.fromValues(vertexArray[faceArray[i+2]*3],vertexArray[faceArray[i+2]*3+1],vertexArray[faceArray[i+2]*3+2]);

        var vect31=vec3.create(), vect21=vec3.create();
        vec3.sub(vect21,vertex2,vertex1);
        vec3.sub(vect31,vertex3,vertex1);
        var v=vec3.create();
        vec3.cross(v,vect21,vect31);

        //add the face normal to all the faces vertices
        normalArray[faceArray[i]*3  ]+=v[0];
        normalArray[faceArray[i]*3+1]+=v[1];
        normalArray[faceArray[i]*3+2]+=v[2];

        normalArray[faceArray[i+1]*3]+=v[0];
        normalArray[faceArray[i+1]*3+1]+=v[1];
        normalArray[faceArray[i+1]*3+2]+=v[2];

        normalArray[faceArray[i+2]*3]+=v[0];
        normalArray[faceArray[i+2]*3+1]+=v[1];
        normalArray[faceArray[i+2]*3+2]+=v[2];

    }

    //normalize each vertex normal
    for(var i=0; i<normalArray.length;i+=3)
    {
        var v = vec3.fromValues(normalArray[i],normalArray[i+1],normalArray[i+2]);
        vec3.normalize(v,v);

        normalArray[i  ]=v[0];
        normalArray[i+1]=v[1];
        normalArray[i+2]=v[2];
    }

    //return the vertex normal
    return normalArray;
}

//-------------------------------------------------------------------------
/**
 * Generate lines from indexed triangles
 * @param faceArray
 * @param lineArray
 */
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);

        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);

        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}

//-------------------------------------------------------------------------
/**
 * Calculate the color for each vertex
 * @author Fanyin Ji
 * @param vertexArray
 * @param colorArray
 * @param num
 */
function colorTerrian(vertexArray, colorArray, num) {
    var max = 0;

    // find the max height among all the vertices
    for(var i =0; i<num; i++){
        if(vertexArray[3*i+2] > max)
            max = vertexArray[3*i+2];

    }
    //var range = max - min; // The absolute height
    for(var i = 0; i<num; i++){
        // White
        if(vertexArray[3*i+2] >= 0.85*max){
            colorArray.push(0.63);
            colorArray.push(0.63);
            colorArray.push(0.63);
            colorArray.push(1.0);
        }
        // Brown
        else if(vertexArray[3*i+2] >= 0.4*max){
            colorArray.push(0.2);
            colorArray.push(0.1);
            colorArray.push(0.0);
            colorArray.push(1.0);
        }
        // Water
        else if(vertexArray[3*i+2] ==0.0){
            colorArray.push(0.0);
            colorArray.push(0.6);
            colorArray.push(0.6);
            colorArray.push(1.0);
        }
        //Grass
        else{
            colorArray.push(0.0);
            colorArray.push(0.4);
            colorArray.push(0.2);
            colorArray.push(1.0);
        }
    }
}

