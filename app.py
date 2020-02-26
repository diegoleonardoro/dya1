import pandas as pd
import psycopg2
import sqlalchemy
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
import numpy as np
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float 
from pprint import pprint
import  json  
import os

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

POSTGRES_ADDRESS = 'localhost' 
POSTGRES_PORT = '5432'
POSTGRES_USERNAME = 'postgres' 
POSTGRES_PASSWORD = 'dd'  
POSTGRES_DBNAME = 'diagnostiya' 
postgres_str = ('postgresql://{username}:{password}@{ipaddress}:{port}/{dbname}'.format(username=POSTGRES_USERNAME,password=POSTGRES_PASSWORD,ipaddress=POSTGRES_ADDRESS,port=POSTGRES_PORT,dbname=POSTGRES_DBNAME))

Base = declarative_base()
engine = create_engine(postgres_str)
conn = engine.connect()

class Ventas (Base):
    __tablename__ = 'ventas'
    id = Column(Integer, primary_key=True)
    canal= Column(String(255))
    asesor = Column(String(255))
    producto = Column(String(255))


# Create the tables associated with the class:
Base.metadata.create_all(engine)


# create a session, which is a temporary binding to the database:
from sqlalchemy.orm import Session
session = Session(bind=engine) 






app = Flask (__name__)

# the following three lines read the geojson data of bogota:
SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
geojson_bogota_url = os.path.join(SITE_ROOT, "data", "bogota.json")
geojson_data = json.load(open(geojson_bogota_url))




@app.route("/")
def home():
    conn.execute("DELETE FROM particulares_livianos WHERE anio = 2021;")

    #SQL queries:
    df_particulares_livianos = pd.read_sql_query('''SELECT * FROM particulares_livianos;''', engine)
    df_taxis = pd.read_sql_query('''SELECT * FROM taxis;''', engine)
    df_motos = pd.read_sql_query('''SELECT * FROM motos;''', engine)
    df_preventivas_livianos = pd.read_sql_query('''SELECT * FROM preventivas_livianos;''', engine)

    #SQL response.to_dict():
    df_part_livianos = df_particulares_livianos.to_dict(orient ="records")
    df_taxis = df_taxis.to_dict(orient = "records")
    df_motos = df_motos.to_dict(orient = "records")
    df_preventivas_livianos =  df_preventivas_livianos.to_dict(orient = "records")


    response = {"particulares_livianos":df_part_livianos, "taxis":df_taxis, "motos":df_motos, "preventivas_livianos" :df_preventivas_livianos  }
    
    return render_template("index.html", response = response )




@app.route("/bogota_geojson")
def get_json_bogota_url():
    global geojson_data
    return json.dumps(geojson_data)



@app.route("/formulario_servicio_al_cliente", methods =['GET', 'POST'])
def get_customer_data():
    return render_template("form.html")



@app.route('/handle_data', methods = ['GET', 'POST'])
def handle_data():
    
    # POST request
    
    if request.method == 'POST':
        
        print('Incoming..')
       
        #print(request.get_json(force=True))  # parse as JSON
       
        global product_data
        product_data = request.get_json(force=True)
       
        print (product_data)
    
        #print (product_data["product_info"]["asesor"])
        #print (product_data["product_info"]["producto"])
        #print (product_data["product_info"]["canal"])



        try:
            record = Ventas (canal = product_data["product_info"]["canal"], asesor = product_data["product_info"]["asesor"], producto = product_data["product_info"]["producto"] )

        except KeyError:
            record = Ventas (canal = product_data["product_info"]["canal"], asesor = "-", producto = product_data["product_info"]["producto"] )


        session.add(record)
        session.commit()



        return jsonify(product_data)

    

    # GET request
    else:
        return jsonify(product_data)  # serialize and use JSON headers













if __name__ == '__main__':
    app.run(debug=True)
