import json
from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
from flask_pymongo import PyMongo
from pymongo import MongoClient
from flask import make_response
from itsdangerous import URLSafeSerializer
from flask import redirect
from werkzeug.security import generate_password_hash,check_password_hash
from flask import jsonify
from passlib.hash import bcrypt
from pydub import AudioSegment
from flask import send_from_directory
from jinja2 import Environment, PackageLoader
from htmlmin import minify
import os
import base64
import datetime
import uuid
import io
import wave
import re
import string
import random
import secrets
import time

app = Flask(__name__)
jinja_env = Environment(loader=PackageLoader('app', 'templates'))
jinja_env.filters['minify'] = minify
app.config['MONGO_URI'] = 'mongodb://127.0.0.1:27017/Documents'
app.config['SECRET_KEY'] = '@1924bRitaNia_Mari//1924//Best_cookie_FoR_eat//1924@'
image_holder = os.path.join('static','images')
app.config['SAVED_IMAGES'] = image_holder
file_holder = os.path.join('static','js')
app.config['STATIC_FILES'] = file_holder
processing_file_holder = os.path.join('static','processing_waves')
app.config['PROCESSING_WAVES'] = processing_file_holder
waves = os.path.join('static','waves')
app.config['WAVES_FOLDER'] = waves
wave_topens = os.path.join('static','topens')
app.config['WAVE_TOPEN_FOLDER'] = wave_topens
commented_recorded_blobs = os.path.join('static','comments')
app.config['SAVED_TUNES'] = commented_recorded_blobs
app_pics = os.path.join('static','app_pics')
app.config['APP_PICS'] = app_pics
comment_replys = os.path.join('static','rplys')
app.config['REPLY'] = comment_replys
data_base = PyMongo(app)

static_files_i_x_page = {
          'js_file':os.path.join(app.config['STATIC_FILES'],'reg_dta_sen_to_srv.js'),
          'css_file':'static\css\\reg_fill_style.css'
      }

def render_login_page():  
    return render_template('i_x.html',files=static_files_i_x_page)
###############################################################################################
###############################################################################################
@app.route('/')
def rendering_conditional_page():
    if request.cookies.get('U_I_S_N'):
        cookie_got = request.cookies.get('U_I_S_N')
        cookie_have = data_base.db.Stations.find_one({'COOKIE_NAME':cookie_got})
        if cookie_have['COOKIE_NAME'] == cookie_got:
            station_name = cookie_have['STATION']
            station_profile_search = data_base.db.Station_profile.find_one({'_STATION_':station_name})
            home_data_object = {
                'name':station_name,
                'img':''
            }
            if station_profile_search:

               if station_profile_search['_IMAGE_'] == None:
                  home_data_object['img'] = ''

               else:
                 db_profile_img_path = station_profile_search['_IMAGE_']
                 home_data_object['img'] =  db_profile_img_path  

            return send_home_page(home_data_object)
           
    
    return render_login_page()


def send_home_page(data):
    
     home_data = {
        'name':data['name'],
        'img':data['img']
     }
     return render_template('ser_wav.html',files=['static\\css\\ser_wav.css','static\\js\\ser_query.js'],data=home_data)
    
    


    
class Station_Owner:
    def __init__(self,station_name,station_passkey,station_email,cookie_name):
        self.station_name = station_name
        self.station_passkey = station_passkey
        self.station_email = station_email
        self.cookie_name = cookie_name

    def save_to_db(self):
        data_base.db.Stations.insert_one({
            'STATION':self.station_name,
            'STATION_PASSKEY':self.station_passkey,
            'STATION_EMAIL':self.station_email,
            'COOKIE_NAME':self.cookie_name
            })
       


@app.route('/submit_form',methods=['POST','GET'])
def sending_response_after_regestering():
    if request.method == 'POST':
        station_name = request.json['s']
        station_passkey = request.json['p']
        station_email = request.json['e']
        search_for_similar_station = data_base.db.Stations.count_documents({'STATION':station_name})
        if search_for_similar_station == 0 :
            
                create_safe_cookie_name = URLSafeSerializer(app.config['SECRET_KEY'])
                encrypted_name = create_safe_cookie_name.dumps(station_name)
                salty_passkey = generate_password_hash(station_passkey)
                mari_gold = make_response()
                mari_gold.set_cookie('U_I_S_N', encrypted_name, max_age=2 * 365 * 24 * 60 * 60)
                send_to_class = Station_Owner(station_name, salty_passkey, station_email, encrypted_name)
                send_to_class.save_to_db()
                data_base.db.Station_profile.insert_one({'_STATION_':station_name,'_DESCRIPTION_':'','_USERSELF_':'','_IMAGE_':'no_image','_COOKIE_':encrypted_name,'LATER_LIST':[],'HISTORY':'true','TUNES':0})
                data_base.db.Tempo_waves.insert_one({'STATION_NAME':station_name,'TEMPO_FILE':''})
                return mari_gold

        
            
        else:
            msg = {
                'duplication_msg':'The Station is existed..!'
            }
            return jsonify(msg)
    return render_login_page()
           
    
@app.route('/login')
def place_station_page():
    return render_template('l_n.html',files=['static\\css\\l_n.css','static/js/lg_fx_scrpt.js'])

@app.route('/search',methods=['POST','GET'])
def find_the_requested_account():
    if request.method == 'POST':
        find_name = request.form['name_of_station']
        find_password = request.form['passkey_of_station']
        searched_data = data_base.db.Stations.find_one({'STATION':find_name})
        if searched_data and check_password_hash(searched_data['STATION_PASSKEY'], find_password):           
               make_cookie = make_response(redirect('/'))
               cookie_string = URLSafeSerializer(app.config['SECRET_KEY'])
               encrypted_name = cookie_string.dumps(find_name)
               make_cookie.set_cookie('U_I_S_N',encrypted_name,max_age=2 * 365 * 24 * 60 * 60)
               return make_cookie
        return render_template('invld.html',files=['static/css/invld.css'])
            
"""Taking User to Thier Station Dashboard"""

static_file_dash_board_page = [
    {
    'css_file':'static\css\das_b_css.css',
    'js_file':'static\js\d_b.js',
    },
    {
    'css_file':'static\css\sta_set_css.css',
     'js_file':'static\js\sta_set.js',
    },
    {
    'css_file':'static\css\create_wv.css',
    'client_aud_handler_js':'static\js\create_packge_main_aud_data_client.js'
    }
    
]

@app.route('/take_to_stat_graph')
def send_dash_board_page_here():
    return render_template('d_b.html',files=['static\\css\\das_b_css.css','static\\js\\d_b.js'])


"""STATION PERFOTMANCE IS SHOWING HERE"""
data = {
        'data':'this is performance'
    }
@app.route('/take_to_stat_com')
def sending_station_performance():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_data = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
        if find_data:
            station_name = find_data['_STATION_']
            find_in_comments = data_base.db.Station_comments.find({'COMMENTER':station_name})
            is_commented = False
            if len(list(find_in_comments)) != 0:
                is_commented = True
            return render_template('sta_com.html',files=['static\\css\\sta_com_css.css','static\\js\\sta_com_js.js'],data=station_name,status=is_commented)

@app.route('/take_to_broad_wav_')
def take_to_broadcasted_waves():
    return render_template('broad_wav.html',files=['static\\css\\brd_wav.css','static\\js\\brd_wv_js.js'])

@app.route('/take_sta_set_')
def sending_station_setting_page_only():
    return take_to_station_settings()

def take_to_station_settings():
    got_cookie = request.cookies.get('U_I_S_N')
    search_user = data_base.db.Station_profile.find_one({'_COOKIE_':got_cookie})
    if search_user:
        sta_name = search_user['_STATION_']
        sta_desc = search_user['_DESCRIPTION_']
        sta_userself = search_user['_USERSELF_']
        sta_img = search_user['_IMAGE_']
        SET_DATA = {
        'name': sta_name,
        'desc':sta_desc,
        'us':sta_userself,
        'img':sta_img
    }  
        return render_template('sta_set.html',files=static_file_dash_board_page[1],DATA=SET_DATA)

    else:
     return render_login_page()

#########################################################################################################
class STATION_PROFILE:
    def __init__(self,sta_name,sta_desc,sta_self,sta_img) :
        self.st_name = sta_name
        self.st_desc = sta_desc
        self.st_self = sta_self
        self.st_img = sta_img

    def save_to_data_base(self):
        browser_cookie = request.cookies.get('U_I_S_N')
        if browser_cookie:
          find_station_profile_account = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
          if find_station_profile_account:
             old_station = find_station_profile_account['_STATION_']
             old_desc = find_station_profile_account['_DESCRIPTION_']
             old_userself = find_station_profile_account['_USERSELF_']
             old_img = find_station_profile_account['_IMAGE_']

             data_base.db.Station_profile.update_one(
            {
        '_STATION_': old_station,
        '_DESCRIPTION_': old_desc,
        '_USERSELF_': old_userself,
        '_IMAGE_': old_img
            },
        {
        '$set': {
            '_STATION_': self.st_name,
            '_DESCRIPTION_': self.st_desc,
            '_USERSELF_': self.st_self,
            '_IMAGE_': self.st_img
        }
    }
)

        
#########################################################################################################

@app.route('/sta_dat', methods=['POST','GET'])
def send_data_to_station_settings():
    if request.method == 'POST':
      check_cookie = request.cookies.get('U_I_S_N')
      if check_cookie:
        if 'n' in request.form:
            u_station_name =  request.form['n']
            search_to_same_user = data_base.db.Stations.find_one({'STATION':u_station_name,'COOKIE_NAME':check_cookie})
            if search_to_same_user:
               return jsonify({'msg':'This Station Is Already Exists..!'})
            else:
             user_cookie = request.cookies.get('U_I_S_N')
             search_doc = data_base.db.Stations.find_one({'COOKIE_NAME':user_cookie})
             if search_doc:
               browser_cookie = search_doc['COOKIE_NAME']
               search_doc_in_station_profile = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
               user_old_name = search_doc_in_station_profile['_STATION_']
               user_prev_cookie = search_doc_in_station_profile['_COOKIE_']
               search_name = search_doc['STATION']
               new_updated_cookie = make_response()
               cookie_string = URLSafeSerializer(app.config['SECRET_KEY'])
               encrypted_name = cookie_string.dumps(search_name)
               new_updated_cookie.set_cookie('U_I_S_N',encrypted_name,2*360*24*60*60)
               #we creates new cookie here becuase in this request user change its name....
               data_base.db.Stations.update_one({'STATION': search_name,'COOKIE_NAME':user_cookie}, {'$set': {'STATION': u_station_name,'COOKIE_NAME':encrypted_name}})       
               # feed bases are updating here
               data_base.db.Station_profile.update_one({'_STATION_':user_old_name,'_COOKIE_':user_prev_cookie},{'$set':{'_STATION_':u_station_name,'_COOKIE_':encrypted_name}})
               data_base.db.Station_comments.update_many({'COMMENTER':user_old_name},{'$set':{'COMMENTER':u_station_name}})
               data_base.db.Station_comments.update_many({'COMMENTED_TO':user_old_name},{'$set':{'COMMENTED_TO':u_station_name}})
               data_base.db.Tempo_waves.update_one({'STATION_NAME':user_old_name},{'$set':{'STATION_NAME':u_station_name}})
               data_base.db.Wave_packages.update_many({'STATION_NAME':user_old_name},{'$set':{'STATION_NAME':u_station_name}})               
               data_base.db.Views.update_many({'STATION_NAME':user_old_name},{'$set':{'STATION_NAME':u_station_name}})
               data_base.db.Views.update_many({'VIEWER':user_old_name},{'$set':{'VIEWER':u_station_name}})
               data_base.db.History.update_many({'STATION_NAME':user_old_name},{'$set':{'STATION_NAME':u_station_name}})
               data_base.db.History.update_many({'VIEWER':user_old_name},{'$set':{'VIEWER':u_station_name}})
               data_base.db.Love.update_many({'LOVED_TO':user_old_name},{'$set':{'LOVED_TO':u_station_name}})
               data_base.db.Love.update_many({'LOVED_FROM':user_old_name},{'$set':{'LOVED_FROM':u_station_name}})
               data_base.db.Clone_data.update_many({'TUNNED_STATION':user_old_name},{'$set':{'TUNNED_STATION':u_station_name}})
               data_base.db.Clone_data.update_one({'TUNNER':user_cookie},{'$set':{'TUNNER':encrypted_name}})
               updated_cookie_strg = new_updated_cookie  
            
        if 'g' in request.form:
                 identify_user = data_base.db.Station_profile.find_one({'_COOKIE_':check_cookie})
                 if identify_user:
                  user_old_description = identify_user['_DESCRIPTION_']
                  new_description = request.form['g']
                  data_base.db.Station_profile.update_one({'_DESCRIPTION_':user_old_description},{'$set':{'_DESCRIPTION_':new_description}})
                  result =  jsonify({'msg':'Updated Successfully'})

        if 'd' in request.form:
                   identify_user = data_base.db.Station_profile.find_one({'_COOKIE_': check_cookie})
                   if identify_user:
                    old_user_self_info = identify_user['_USERSELF_']
                    new_user_self_info = request.form['d']
                    data_base.db.Station_profile.update_one({'_USERSELF_': old_user_self_info}, {'$set': {'_USERSELF_': new_user_self_info}})
                    result =  jsonify({'msg': 'Updated Successfully'})

        if 'i' in request.files:
                   identify_user = data_base.db.Station_profile.find_one({'_COOKIE_': check_cookie})
                   station_name = identify_user['_STATION_']
                   if identify_user:
                       user_old_img = identify_user['_IMAGE_']
                       user_new_img = request.files['i']
                       time_stamp = datetime.datetime.now().strftime('%d_%m_%Y_%S')
                       file_name = time_stamp + user_new_img.filename
                       user_new_img.save(os.path.join(app.config['SAVED_IMAGES'],file_name))
                       data_base.db.Station_profile.update_one({'_STATION_':station_name,'_IMAGE_': user_old_img}, {'$set': {'_IMAGE_': file_name}})
                       data_base.db.Station_comments.update_many({'_STATION_':station_name,'COMMENTER_PROFILE_IMAGE': user_old_img}, {'$set': {'COMMENTER_PROFILE_IMAGE': file_name}})

                       result =  jsonify({'msg': 'Updated Successfully'})


       
        if 'updated_cookie_strg' in locals():
           return updated_cookie_strg
        else:
            pass
        
        if 'result' in locals():
            return result
        else:
            pass
          
      return render_login_page()
    
    return jsonify({'msg': 'Invalid request'}) 


@app.route('/send_pro_data',methods=['POST'])
def send_profile_setting_data_to_station_settings_page():
     got_cookie = request.cookies.get('U_I_S_N')
     browser_cookie = data_base.db.Station_profile.find_one({'_COOKIE_':got_cookie})
     
     if browser_cookie:
         station = browser_cookie['_STATION_']
         desc = browser_cookie['_DESCRIPTION_']
         userself = browser_cookie['_USERSELF_']
         img = browser_cookie['_IMAGE_']

         
         profile_data = {
            'station': station,
            'is_image' : img,
        }
         return jsonify(profile_data)
     else:
         return render_login_page()
         

@app.route('/take_to_cr_wv')
def take_to_create_station_pannel():
    return render_template('cr_wv.html',files=static_file_dash_board_page[2])


@app.route('/send_users_media_file', methods=['POST', 'GET'])
def sending_processing_wave_file_to_create_its_wave_pattern():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        user_media_file = request.files['file']
        file_name = user_media_file.filename
        find_in_db = data_base.db.Stations.find_one({'COOKIE_NAME': browser_cookie})
        station_name = find_in_db['STATION']
        file_root = 'this_is_temp_file_' + station_name + '-' + file_name
        user_media_file.save(os.path.join(app.config['PROCESSING_WAVES'], file_root))
        find_name_in_Tempo_db = data_base.db.Tempo_waves.find_one({'STATION_NAME': station_name})
        if find_name_in_Tempo_db:
            prev_file = find_name_in_Tempo_db['TEMPO_FILE']
            data_base.db.Tempo_waves.update_one({'TEMPO_FILE': prev_file}, {'$set': {'TEMPO_FILE': file_root}})
            search_Tempo_db = data_base.db.Tempo_waves.find_one({'STATION_NAME': station_name})
            if search_Tempo_db:
                file_to_send_to_client_to_create_wave_pattern = search_Tempo_db['TEMPO_FILE']
                return_file_path = {
                    'path': os.path.join(app.config['PROCESSING_WAVES'], file_root)
                }
                return jsonify(return_file_path)
    return jsonify({'path': '/'})

@app.route('/respose_of_audio_file',methods=['POST','GET'])
def save_responded_main_wave_to_db():
      wave_file = None
      wave_topen = None
      if request.method == 'POST':
          if request.cookies.get('U_I_S_N'):
              browser_cookie = request.cookies.get('U_I_S_N')
              user_existence = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
              station_name = user_existence['_STATION_']
              if 'Recorded_wave' in request.files:
                 recorded_file = request.files['Recorded_wave']
                 wave_file = recorded_file

              if 'User_file' in request.files:
                  user_file = request.files['User_file']
                  wave_file = user_file
              if 'wav_topen' in request.files:
                  wave_topen = request.files['wav_topen']
              else:
                  wave_topen = ''

              if wave_file:
               wave_title = request.form['wav_name']
               wave_desc = request.form['wav_desc']
               wave_topen = wave_topen
               current_day = datetime.datetime.now().strftime('%d')
               current_month = datetime.datetime.now().strftime('%m')
               current_year = datetime.datetime.now().strftime('%Y')
               current_hour = datetime.datetime.now().strftime('%f')
               time_stamp =   current_day + '-' + current_month + '-' + current_year + '-' + current_hour + '-'
               file_name =   station_name + '-' + time_stamp + wave_file.filename
               wave_file.save(os.path.join(app.config['WAVES_FOLDER'],file_name))
               if wave_topen != '':
                  topen_file = station_name + '-' + time_stamp + wave_topen.filename 
                  wave_topen.save(os.path.join(app.config['WAVE_TOPEN_FOLDER'],topen_file))
               else:
                   topen_file = ''
              data_base.db.Wave_packages.insert_one({
                  'STATION_NAME':station_name,
                  'WAVE_FILE':file_name,
                  'WAVE_TITLE':wave_title,
                  'WAVE_DESCRIPTION':wave_desc,
                  'WAVE_TOPEN':topen_file,
                  'TIME':time_stamp                  
                })
               
               #filterin inputed wave and save it in 
               
          else:
              return render_login_page()
      return jsonify({'msg':'got it...!','path': 'static\\tunes\\the-notification-email-143029.mp3'})


@app.route('/save_to_tunned_list',methods=['POST'])
def save_later_list_to_its_db():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_Station_profile = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
        station_name = find_in_Station_profile['_STATION_']
        if find_in_Station_profile:
           new_later = request.json['pckg']
           if new_later['station']!= station_name:
            find_in_user_db = data_base.db.Station_profile.find_one({
    '_STATION_': station_name,
    'LATER_LIST': {'$elemMatch': new_later}
                     })
            
            if find_in_user_db is None:
              data_base.db.Station_profile.update_one({'_STATION_':station_name}, {'$addToSet': {'LATER_LIST': new_later}})
              data_base.db.Clone_data.insert_one({'TUNNED_STATION':new_later['station'],'TUNNER':browser_cookie})
              data_base.db.Station_profile.update_one({'_STATION_':new_later['station']},{'$inc':{'TUNES':1}})
            return jsonify({'path':'static\\tunes\\New_Project.mp3'})
           else:
               return jsonify({'path':'static\\tunes\\New_Project.mp3'})
               
        else:
            return jsonify('path','/')
        
@app.route('/commenting',methods=['POST'])
def commenting_to_desired_station_of_user():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
        commenter_name = find_in_db['_STATION_']
        if commenter_name:
            comment = request.files['cmt']
            commented_to = request.form['commented_to']
            comment_to_ttl = request.form['comment_to_ttl']
            wave_date_which_is_commented = request.form['commented_to_wv_date']
            commented_date = datetime.datetime.now().strftime('%d_%m_%Y')
            commenter_img = find_in_db['_IMAGE_']
            random_string = secrets.token_hex(10)
            file_name = random_string + commented_to + commented_date  + comment.filename
            comment.save(os.path.join(app.config['SAVED_TUNES'],file_name))
            data_base.db.Station_comments.insert_one({'COMMENT':file_name,'COMMENTER':commenter_name,'COMMENTED_TO':commented_to,'COMMENTED_TO_TITLE':comment_to_ttl,'ON_DATE':commented_date,'WAVE_BROADCASTED_DATE':wave_date_which_is_commented})
            return jsonify({'path':'static/tunes/upload_comment.mp3','name':commented_to})
    else:
        return render_login_page()

def count_cmts_and_give_unit(number):
    units = ['','k','M','B','T']
    for unit in units:
        if abs(number) < 1000.0:
            formatted_number = f"{int(number):.1f}" if number % 1 else f"{int(number)}"
            return f"{formatted_number} {unit}".strip()
        number /= 1000.0
    return f"{int(number):.1f} {units[-1]}".strip()
@app.route('/ld_mr_cmt', methods=['GET'])
def passing_more_station_comments_if_it_available():
    page_number = int(request.args.get('pg_nm'))
    page_size = int(request.args.get('pg_sz'))
    skip_count = (page_number - 1) * page_size
    station_name = request.args.get('comments')
    station_title = request.args.get('tite')
    count_cmts = list(data_base.db.Station_comments.find({
        'COMMENTED_TO': station_name,'WAVE_BROADCASTED_DATE':station_title
    }))
    counts = count_cmts_and_give_unit(len(count_cmts))
    find_cmts_in_db = data_base.db.Station_comments.find(
        {'COMMENTED_TO': station_name,'WAVE_BROADCASTED_DATE':station_title}
    ).skip(skip_count).limit(page_size)
    cmt_holder = []
    for cmt in find_cmts_in_db:
        full_cmt_pack = {
            'COMMENT': cmt['COMMENT'],
            'COMMENTER': cmt['COMMENTER'],
            'COMMENTED_TO': cmt['COMMENTED_TO'],
            'COMMENTED_TO_TITLE': cmt['COMMENTED_TO_TITLE'],
            'ON_DATE': cmt['ON_DATE']
        }
        find_profile_image = data_base.db.Station_profile.find_one({'_STATION_': full_cmt_pack['COMMENTER']})
        if find_profile_image:
            full_cmt_pack['COMMENTER_PROFILE_IMAGE'] = find_profile_image['_IMAGE_']
        cmt_holder.append(full_cmt_pack)

    return jsonify({'cmts':cmt_holder,'counts':counts})

    

        
"""@app.route('/fetch_data',methods=['GET'])
def sending_more_feed_data():
    place_package_to_this = []
    page = request.args.get('page',1,type=int)
    items_per_page = 1
    offset = (page -1) * items_per_page
    data = data_base.db.Wave_packages.find().skip(offset).limit(1)
    for package in data:
            wave_file = package.get('WAVE_FILE')
            topen_file = package['WAVE_TOPEN']
            station_name = package.get('STATION_NAME')
            find_in_a_station_profile_db = data_base.db.Station_profile.find_one({'_STATION_':station_name})
            if find_in_a_station_profile_db:
                station_img = find_in_a_station_profile_db.get('_IMAGE_')
                station_desc = find_in_a_station_profile_db.get('_DESCRIPTION_')
                station_userself = find_in_a_station_profile_db.get('_USERSELF_')

                wave = {
                'STATION':package['STATION_NAME'],
                'STATION_IMAGE':station_img,
                'STATION_DESC':station_desc,
                'STATION_USERSELF':station_userself,
                'WAVE':os.path.join(app.config['WAVES_FOLDER'],wave_file),
                'TITLE':package['WAVE_TITLE'],
                'DESCRIPTION':package['WAVE_DESCRIPTION'],
                'TOPEN':topen_file,
                'DATE':package['TIME']
                }
                place_package_to_this.append(wave)
    next_data = page + 1
    return jsonify({'wave':place_package_to_this, 'next_data':next_data})"""

@app.route('/searching_query',methods=['GET'])
def search_user_serch_query():
    key = request.args.get('key') 
    page_size = int(request.args.get('pg_sz')) 
    page_number = int(request.args.get('pg_num'))
    skip_count = (page_number - 1) * page_size
    requested_value = key.split(',')
    regex_pattern = re.compile(key,re.IGNORECASE)
    regex_query = regex_pattern.pattern
    query_document = {
        '$or': [
            {'STATION_NAME': {'$regex': regex_query,'$options':'i'}},
            {'WAVE_TITLE': {'$regex':regex_query,'$options':'i'}},
            {'WAVE_DESCRIPTION': {'$regex':regex_query,'$options':'i'}}
        ]
        }
    wave = data_base.db.Wave_packages.find(query_document).skip(skip_count).limit(page_size)
    data_holder = []
    if wave:
        for data in wave:
           founded_wave = {
                'st_n':data['STATION_NAME'],
                'wv':os.path.join(app.config['WAVES_FOLDER'],data['WAVE_FILE']),
                'tTl':data['WAVE_TITLE'],
                'dec':data['WAVE_DESCRIPTION'],
                'tOpEn':data['WAVE_TOPEN'],
                'tD':data['TIME']
           }
           data = data_base.db.Station_profile.find_one({'_STATION_':data['STATION_NAME']})
           if data:
               founded_wave['st_i'] = data['_IMAGE_']
             #  founded_wave['st_g'] = data['_DESCRIPTION_']
              # founded_wave['usr_slf'] = data['_USERSELF_']
           data_holder.append(founded_wave)
    response = {
        'status': data_holder
    }
    return jsonify(response)
data_route = None
@app.route('/requested_wave')
def sending_founded_requesting_wave():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
         find_name = data_base.db.Station_profile.find_one({
            '_COOKIE_':browser_cookie
        })
         
         tunned = None
         data = request.args.get('data')
         load_to_json_first_time = json.loads(data)
         if find_name:
            station_name = find_name['LATER_LIST']
            for station in station_name:
                if station['station'] == load_to_json_first_time['st_n']:
                    tunned = True
         else:
             tunned = False
         if data:
            data = json.loads(data)
            objectify_requested_data = {
                'STATION':  data['st_n'],
                'WAVE': data['wv'],
                'TITLE': data['tTl'],
                'TOPEN': data['tOpEn'],
                'DATE': data['tD']
            }
            find_desc = data_base.db.Wave_packages.find_one({'STATION_NAME':objectify_requested_data['STATION'],'WAVE_TITLE':objectify_requested_data['TITLE'],'TIME':objectify_requested_data['DATE']})
            if find_desc:
                wave_desc = find_desc['WAVE_DESCRIPTION']
                objectify_requested_data['WAVE_DESCRIPTION'] = wave_desc
            else:
                  return render_template('nt_avil.html')

            find_station_image = data_base.db.Station_profile.find_one({
                '_STATION_':objectify_requested_data['STATION']
            })
            print('this is ',objectify_requested_data)
            if find_station_image:
                objectify_requested_data['STATION_IMAGE'] = find_station_image['_IMAGE_']

         return render_template('reqsted_wav.html',files=['static\\css\\blg.css','static\\js\\blg_js.js'],date=objectify_requested_data['DATE'][:10],requested_wave=objectify_requested_data,tnd=tunned)
    return render_login_page()

@app.route('/lod_mr_dta',methods=['GET'])
def load_more_data():
        if request.cookies.get('U_I_S_N'):
            page_number = int(request.args.get('pg_num'))
            page_size = int(request.args.get('pg_sz'))
            data = request.args.get('data')
            skip_count = (page_number - 1) * page_size
            if data:
              document_holder = []
              find_in_db = data_base.db.Wave_packages.find({'STATION_NAME': data}).skip(skip_count).limit(page_size)
              for document in find_in_db:
                wave = {
                    'STATION': document['STATION_NAME'],
                    'WAVE':os.path.join(app.config['WAVES_FOLDER'],document['WAVE_FILE']),
                    'TITLE': document['WAVE_TITLE'],
                    'DESCRIPTION': document['WAVE_DESCRIPTION'],
                    'TOPEN': document['WAVE_TOPEN'],
                    'DATE': document['TIME']
                }
                station_img = data_base.db.Station_profile.find_one({'_STATION_':data})
                if station_img:
                    wave['STATION_IMAGE'] = station_img['_IMAGE_']
                document_holder.append(wave)
              return jsonify(info=document_holder)
        return render_login_page()
  
def send_requested_station():
    return render_template('reqsted_wav.html')

@app.route('/station_profile')
def render_profile_page():
    station_name = request.args.get('_search')
    find_db = data_base.db.Station_profile.find_one({'_STATION_':station_name})
    if find_db:
        send_station_profile_pckt = {
                'STATION': station_name,
                'DESCRIPTION': find_db['_DESCRIPTION_'],
                'USERSELF': find_db['_USERSELF_'],
                'IMAGE': find_db['_IMAGE_']
        }
    return render_template('sta_prof.html',user_data=send_station_profile_pckt,files=['static\\css\\prof_pg.css','static\\js\\sta_prof_js.js'])
@app.route('/ld_prof_cmts', methods=['GET'])
def send_profile_cmts():
    if request.cookies.get('U_I_S_N'):
      page_num = int(request.args.get('pag_num'))
      page_size = int(request.args.get('pag_sze'))
      skip_count = (page_num - 1) * page_size
      station_name = request.args.get('station')
      find_in_db = data_base.db.Station_comments.find({'COMMENTER': station_name}).skip(skip_count).limit(page_size)
      if find_in_db:
        comment_holder = []
        for pckt in find_in_db:
            cmt_pckt = {
                'COMMENT': pckt['COMMENT'],
                'COMMENTED_TO': pckt['COMMENTED_TO'],
                'TITLE': pckt['COMMENTED_TO_TITLE'],
                'DATE': pckt['ON_DATE'],
                'COMMENTER':pckt['COMMENTER'],
                'WAVE_DATE':pckt['WAVE_BROADCASTED_DATE']

            }
           
            station_image = data_base.db.Wave_packages.find_one(
                {'STATION_NAME': cmt_pckt['COMMENTED_TO'], 'WAVE_TITLE': cmt_pckt['TITLE']}
            )
            station_profile_img = data_base.db.Station_profile.find_one({'_STATION_':cmt_pckt['COMMENTED_TO']})
            if station_image:
               
               wave_pckt = {
                 "WAVE_FILE": os.path.join(app.config['WAVES_FOLDER'],station_image['WAVE_FILE']),
                 "WAVE_TITLE": station_image['WAVE_TITLE'],
                 "WAVE_DESCRIPTION": station_image['WAVE_DESCRIPTION'],
                 "WAVE_TOPEN": station_image['WAVE_TOPEN'],
                 "TIME": station_image['TIME'],
                 "STATION":station_image['STATION_NAME'],
                 "STATION_IMAGE":station_profile_img['_IMAGE_']
              }
               cmt_pckt['STATION_IMAGE'] = wave_pckt
               comment_holder.append(cmt_pckt)
        return jsonify({'data':comment_holder})
    else:
        return render_login_page()
    
@app.route('/ld_usr_wavs',methods=['GET'])
def send_users_broadcasted_waves():
    if request.method == 'GET':
        if request.cookies.get('U_I_S_N'):
            browser_cookie = request.cookies.get('U_I_S_N')
            page_number = int(request.args.get('pg_num'))
            page_size = int(request.args.get('pg_sz'))
            skip_count = (page_number-1)*page_size
            user_identity = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
            if user_identity:
                user_name = user_identity['_STATION_']
                find_waves = data_base.db.Wave_packages.find({'STATION_NAME':user_name}).skip(skip_count).limit(page_size)
                wave_holder = []
                if find_waves:
                    for wave in find_waves:
                        wave_pack = {
                       "STATION_NAME": wave['STATION_NAME'],
                       "WAVE_FILE":os.path.join(app.config['WAVES_FOLDER'],wave['WAVE_FILE']),
                       "WAVE_TITLE": wave['WAVE_TITLE'],
                       "WAVE_DESCRIPTION": wave['WAVE_DESCRIPTION'],
                       "WAVE_TOPEN": wave['WAVE_TOPEN'],
                        "TIME": wave['TIME']
                        }
                        data = data_base.db.Station_profile.find_one({'_STATION_':wave['STATION_NAME']})
                        if data:
                          wave_pack['STATION_IMAGE'] = data['_IMAGE_']
                        wave_holder.append(wave_pack)
                    return(wave_holder)
                else:
                    return jsonify({'msg':'You Have Not Any Broadcasted Waves..!'})
        else:
            return render_login_page()

@app.route('/dlt_wavXXX', methods=['GET'])
def delete_user_requested_wave():
    if request.method == 'GET':
        browser_cookie = request.cookies.get('U_I_S_N')
        if browser_cookie:
            delete_this_wav = request.args.get('data')
            pckt = json.loads(delete_this_wav)
            station = pckt['st_n']
            wave_ttl = pckt['tTl']
            wave_date = pckt['tD']
            
            document_to_delete = data_base.db.Wave_packages.find_one({
                'STATION_NAME': station,
                'WAVE_TITLE': wave_ttl,
                'TIME': wave_date
                                        })
            delete_this_from_history = data_base.db.History.find_one({
                'STATION_NAME': station,
                'TITLE': wave_ttl,
                'DATE': wave_date
                
                                        })

            if document_to_delete:
                dlt_topen = document_to_delete['WAVE_TOPEN']
                file_name = os.path.join(app.config['WAVE_TOPEN_FOLDER'],dlt_topen)
                os.remove(file_name)
                data_base.db.Wave_packages.delete_one(document_to_delete)
                dlt_this_file = document_to_delete['WAVE_FILE']
                file_path = os.path.join(app.config['WAVES_FOLDER'],dlt_this_file)
                os.remove(file_path)
                data_base.db.History.delete_many(delete_this_from_history)
                

                return jsonify({'msg': 'Wave has been deleted.'})
            else:
                return jsonify({'msg': 'Cannot delete the wave.'})
        return jsonify({'msg': 'Invalid browser cookie.'})
    return render_login_page()

@app.route('/updt_new_wav')
def update_wave():
    if request.cookies.get('U_I_S_N'):
        path = request.args.get('path')
        wave_package = {}  # Initialize with a default value
        
        if path:
            objectify_requested_data = request.args.get('path')
            objectify_requested_data = eval(objectify_requested_data)
            st_n = objectify_requested_data.get('st_n')
            st_i = objectify_requested_data.get('st_i')
            wv = objectify_requested_data.get('wv')
            tTl = objectify_requested_data.get('tTl')
            tOpEn = objectify_requested_data.get('tOpEn')
            tD = objectify_requested_data.get('tD')
            find_wave = data_base.db.Wave_packages.find_one({
                'STATION_NAME': st_n,
                'WAVE_TITLE': tTl,
                'TIME': tD
            })

        if find_wave:
                wave_package = {
                    'st_n': find_wave['STATION_NAME'],
                    'st_i': st_i,
                    'wv': os.path.join(app.config['WAVES_FOLDER'],find_wave['WAVE_FILE']),
                    'tTl': find_wave['WAVE_TITLE'],
                    'tOpEn': find_wave['WAVE_TOPEN'],
                    'tD': find_wave['TIME'],
                    'wv_dec':find_wave['WAVE_DESCRIPTION']
                }

        return render_template('updt_wav.html', files=['static\\css\\updt_css.css','static\\js\\updt_js.js'],obj=wave_package)
    return render_login_page()

   
@app.route('/updt_dta',methods=['POST'])
def make_update_in_wave():
    if request.cookies.get('U_I_S_N'):
        msg = None
        browser_cookie = request.cookies.get('U_I_S_N')
        wave_title = request.form['U_ttl']
        wave_description = request.form['desc']
        station_name = request.form['station_n']
        wave_old_title = request.form['wv_name_old']
        wave_old_date = request.form['tD_old']
        if 'tpn_file' in request.files:
          wave_topen = request.files['tpn_file']
          current_day = datetime.datetime.now().strftime('%d')
          current_month = datetime.datetime.now().strftime('%m')
          current_year = datetime.datetime.now().strftime('%Y')
          current_hour = datetime.datetime.now().strftime('%H')
          time_stamp =   current_day + '-' + current_month + '-' + current_year + '-' + current_hour + '-'
          topen_file = station_name + '-' + time_stamp + wave_topen.filename 
          wave_topen.save(os.path.join(app.config['WAVE_TOPEN_FOLDER'],topen_file))
          find_in_db = data_base.db.Wave_packages.find_one({
            'STATION_NAME':station_name,
            'WAVE_TITLE':wave_old_title,
            'TIME':wave_old_date
        })
          update_wave = data_base.db.Wave_packages.update_one({
            'STATION_NAME':station_name,
            'WAVE_TITLE':wave_old_title,
            'TIME':wave_old_date,
            'WAVE_TOPEN':find_in_db['WAVE_TOPEN']
            },{'$set':{
            'WAVE_TOPEN':topen_file
            }})
          find_in_love = data_base.db.Love.update_one({
              'LOVED_TO':station_name,
              'LOVED_TITLE':wave_old_title,
              'LOVED_DATE':wave_old_date,

        },{
            '$set':{
                'LOVED_TOPEN':topen_file
            }
        })
          find_in_history = data_base.db.History.update_one({
              'STATION_NAME':station_name,
              'TITLE':wave_old_title,
              'DATE':wave_old_date
          },{
              '$set':{
                  'TOPEN':topen_file
              }
          })
          find_in_views = data_base.db.Views.update_one({
              'STATION_NAME':station_name,
              'TITLE':wave_old_title,
              'DATE':wave_old_date
          },{
              '$set':{
                  'TOPEN':topen_file
              }
          })
        find_in_db = data_base.db.Wave_packages.find_one({
            'STATION_NAME':station_name,
            'WAVE_TITLE':wave_old_title,
            'TIME':wave_old_date
        })
        if find_in_db:
            update_wave = data_base.db.Wave_packages.update_one({
            'WAVE_TITLE':wave_old_title,
            'WAVE_DESCRIPTION':find_in_db['WAVE_DESCRIPTION']
            },{'$set':{
            'WAVE_TITLE':wave_title,
            'WAVE_DESCRIPTION':wave_description
            }})
            msg = 'Updated Successfully..!'
        return({'msg':msg})
    return render_login_page()


@app.route('/rmvr_wav_tpn',methods=['GET'])
def remvr_wave_topen():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        station_name = request.args.get('st_n')
        wave_title = request.args.get('tTl')
        wave_date = request.args.get('tD')
        find_wave = data_base.db.Wave_packages.find_one({'STATION_NAME':station_name,'WAVE_TITLE':wave_title,'TIME':wave_date})
        if find_wave:
            filename = os.path.join(app.config['WAVE_TOPEN_FOLDER'],find_wave['WAVE_TOPEN'])
            os.remove(filename)
            data_base.db.Wave_packages.update_one({
                'STATION_NAME':station_name,
                'WAVE_TITLE':wave_title,
                'TIME':wave_date
            },{'$set':{
                'WAVE_TOPEN':''
            }})
            return jsonify({'msg':'rmved'})
    return render_login_page()





@app.route('/save_love_of_station', methods=['POST'])
def save_station_love_to_Station_profile_db():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_': browser_cookie
        })
        if find_in_db:
            lover_name = find_in_db['_STATION_']
            love_to = request.json['pckg']
            if lover_name != love_to['station']:
            # Check if the document already exists
              existing_document = data_base.db.Love.find_one({
                'LOVED_TO': love_to['station'],
                'LOVED_TITLE': love_to['title'],
                'LOVED_DATE': love_to['date'],
                'LOVED_TOPEN': love_to['topen'],
                'LOVED_FROM': lover_name
            })
            
              if existing_document:
                # Document already exists, do not save again
                return {'path': 'static\\tunes\\twinkle.mp3'}
              else:
                # Document does not exist, save it
                data_base.db.Love.insert_one({
                    'LOVED_TO': love_to['station'],
                    'LOVED_TITLE': love_to['title'],
                    'LOVED_DATE': love_to['date'],
                    'LOVED_TOPEN': love_to['topen'],
                    'LOVED_FROM': lover_name
                })
            return {'path': 'static\\tunes\\twinkle.mp3'}
    else:
        return render_login_page()


    
@app.route('/ld_lkes_dte',methods=['POST'])
def ld_user_love_to_their_station_dashboard():
   browser_cookie = request.cookies.get('U_I_S_N')
   if browser_cookie:
       find_db = data_base.db.Station_profile.find_one({
           '_COOKIE_':browser_cookie
       })
       if find_db:
           page_number = int(request.args.get('pag_num'))
           page_size = int(request.args.get('pag_sze'))
           skip_count = (page_number - 1) * page_size
           station_name = find_db['_STATION_']
           if station_name:
               find_lover = data_base.db.Love.find({
                   'LOVED_TO':station_name
               }).skip(skip_count).limit(page_size)

           if find_lover:
              lover_holder = []
              for lover in find_lover:
                   love_pckt = {
                     'LOVED_TO':lover['LOVED_TO'],
                     'LOVED_TITLE':lover['LOVED_TITLE'],
                     'LOVED_DATE':lover['LOVED_DATE'],
                     'LOVED_TOPEN':lover['LOVED_TOPEN'],
                     'LOVED_FROM':lover['LOVED_FROM']
               }
                   find_prof_pic = data_base.db.Station_profile.find_one({'_STATION_':lover['LOVED_FROM']})
                   if find_prof_pic:
                       love_pckt['ROMEO_PIC'] = find_prof_pic['_IMAGE_']
                   lover_holder.append(love_pckt)
           find_in_views = data_base.db.Views.find({
                  'STATION_NAME':station_name
              }).skip(skip_count).limit(page_size)

           if find_in_views:
                  viewr_holder = []
                  for viewr in find_in_views:
                     view_pckt = {
                      'STATION_NAME': viewr['STATION_NAME'],
                      'TITLE': viewr['TITLE'],
                      'TOPEN': viewr['TOPEN'],
                      'DATE': viewr['DATE'],
                      'VIEWER':viewr['VIEWER']
                     }
                     find_prof_pic = data_base.db.Station_profile.find_one({'_STATION_':viewr['VIEWER']})
                     if find_prof_pic:
                       view_pckt['VIEWER_PIC'] = find_prof_pic['_IMAGE_']
                     viewr_holder.append(view_pckt)

           return jsonify({'love':lover_holder,'view':viewr_holder})          
       return jsonify({'msg':station_name})
   return render_login_page()

@app.route('/ld_stats',methods=['POST'])
def calculate_stats():
     browser_cookie = request.cookies.get('U_I_S_N')
     if browser_cookie:
       find_db = data_base.db.Station_profile.find_one({
           '_COOKIE_':browser_cookie
       })
       if find_db:
           station_name = find_db['_STATION_']
           if station_name:
               find_lover = data_base.db.Love.find({
                   'LOVED_TO':station_name
               })
           if find_lover:
              love = 0
              for lover in find_lover:
                   love_pckt = {
                     'LOVED_TO':lover['LOVED_TO'],
                     'LOVED_TITLE':lover['LOVED_TITLE'],
                     'LOVED_DATE':lover['LOVED_DATE'],
                     'LOVED_TOPEN':lover['LOVED_TOPEN'],
                     'LOVED_FROM':lover['LOVED_FROM']
               }
                   love = love + 1
              find_in_views = data_base.db.Views.find({
                  'STATION_NAME':station_name
              })
              view = 0
            
              if find_in_views:
                  for viewr in find_in_views:
                     view_pckt = {
                      'STATION_NAME': viewr['STATION_NAME'],
                      'TITLE': viewr['TITLE'],
                      'TOPEN': viewr['TOPEN'],
                      'DATE': viewr['DATE'],
                      'VIEWER':viewr['VIEWER']
                     } 
                     view = view + 1 
              find_in_tuned = data_base.db.Clone_data.find({"TUNNED_STATION":station_name})
              ttl_tun  = 0
              for tune in find_in_tuned:
                  ttl_tun = ttl_tun + 1
              if view > 0 or love > 0 or ttl_tun > 0:
                  stats = []
                  stats.append(view)
                  stats.append(love) 
                  stats.append(ttl_tun)
                  return jsonify({'stats':stats})
              return jsonify({'stats':'no_stats'})
     return render_login_page()

@app.route('/dlt_cmtXXX',methods=['GET'])
def delete_users_selected_comment():
    if request.method == 'GET':
        browser_cookie = request.cookies.get('U_I_S_N')
        if browser_cookie:
            if browser_cookie:
             delete_this_wav = request.args.get('data')
             pckt = json.loads(delete_this_wav)
             commenter = pckt['COMMENTER']
             commented_to = pckt['COMMENTED_TO']
             commented_on = pckt['DATE']
             commented_title = pckt['TITLE']
            
             document_to_delete = data_base.db.Station_comments.find_one({
            'COMMENTER':commenter,
             'COMMENTED_TO':commented_to,
             'COMMENTED_TO_TITLE':commented_title,
               'ON_DATE':commented_on
                })

            if document_to_delete:
                find_rplys = data_base.db.Comment_replys.find({
                    'commenters_file_name':document_to_delete['COMMENT'],
                    'commter_commented_on':document_to_delete['ON_DATE'],
                    'rply_to':document_to_delete['COMMENTED_TO']
                })
                if find_rplys:
                    for rply in find_rplys:
                        file_name = os.path.join(app.config['REPLY'],rply['reply'])
                        os.remove(file_name)
                        data_base.db.Comment_replys.delete_one(rply) 
                data_base.db.Station_comments.delete_one(document_to_delete)
                file_name = document_to_delete['COMMENT']
                dlt_this_cmt = os.path.join(app.config['SAVED_TUNES'],file_name)
                os.remove(dlt_this_cmt)
                return jsonify({'msg': 'Comment has been deleted.'})
            else:
                return jsonify({'msg': 'Cannot delete the Comment.'})
        return render_login_page()
 
@app.route('/ht_pg')
def send_users_likes_waves():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_':browser_cookie
        })
        find_history_status = find_in_db['HISTORY']
        return render_template('ht_pg.html',files=['static\\js\\lk_pg_spt.js','static\\css\\ht_pg.css'],status=find_history_status)
    return render_login_page()

@app.route('/ld_ht', methods=['GET'])
def sending_users_history():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_': browser_cookie
        })
        if find_in_db:
            station_name = find_in_db['_STATION_']
            find_in_db = data_base.db.Station_profile.find_one({'_STATION_': station_name})
            page_number = int(request.args.get('pag_num'))
            page_size = int(request.args.get('pag_sze'))
            skip_count = (page_number - 1) * page_size
            find_in_history = data_base.db.History.find({
                'VIEWER': station_name
            }).skip(skip_count).limit(page_size)
            found_history = list(find_in_history)
            if found_history:
                view_holder = []
                for HT_doc in found_history:
                    ht_pckt = {
                        'STATION_NAME': HT_doc['STATION_NAME'],
                        'WAVE': HT_doc['WAVE'],
                        'TITLE': HT_doc['TITLE'],
                        'TOPEN': HT_doc['TOPEN'],
                        'DATE': HT_doc['DATE'],
                        'VIEW_DATE': HT_doc['VIEW_DATE'],
                        'VIEWER': HT_doc['VIEWER']
                    }
                    if find_in_db:
                        ht_pckt['IS_TRUE'] = find_in_db['HISTORY']
                    view_holder.append(ht_pckt)
                return jsonify(view_holder)
            return jsonify({'msg': 'no history'})
    return render_login_page()

                    
@app.route('/dlt_al_ht')
def delete_whole_history_of_user():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_':browser_cookie
        })
        if find_in_db:
            station_name = find_in_db['_STATION_']
            data_base.db.History.delete_many({
                'VIEWER': station_name
            })
            return jsonify({'msg':'Deleted'})
        return jsonify({'Didn\'t Deleted'})
    return render_login_page()

@app.route('/stp_svg_ht',methods=['GET'])
def pausing_saving_history_of_user():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.update_one({
            '_COOKIE_':browser_cookie
        },{
            '$set':{
                'HISTORY':'false'
            }
        })
        return jsonify({'path':'static\\tunes\\upload_comment.mp3'})
    return render_login_page()



@app.route('/strt_svg_ht',methods=['GET'])
def start_saving_user_history():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.update_one({
            '_COOKIE_':browser_cookie
        },{
            '$set':{
                'HISTORY':'true'
            }
        })
        return jsonify({'path':'static\\tunes\\the-notification-email-143029.mp3'})
    return render_login_page()

@app.route('/dlt_one_ht_frm',methods=['GET'])
def delete_user_selected_history_frame():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        selected_frame = request.args.get('frm')
        load_to_json = json.loads(selected_frame)
        pckt_for_deletion = {
            "VIEWER":load_to_json['VIEWER'],
            "TITLE":load_to_json['TITLE'],
            "VIEW_DATE":load_to_json['VIEW_DATE'],
            "STATION_NAME":load_to_json['VIEWED_STATION']
        }
        find_in_data = data_base.db.History.delete_one(pckt_for_deletion)
            
        return jsonify({'path':'static\\tunes\\the-notification-email-143029.mp3'})
    return render_login_page()

@app.route('/pn_pg')
def sending_users_pinned_stations():
    return render_template('tun_pg.html',files=['static\\css\\tun_pg.css','static\\js\\tun_pg.js'])

@app.route('/ld_tns')
def sending_users_tunned_stations():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_data = data_base.db.Station_profile.find_one({'_COOKIE_': browser_cookie})
        if find_in_data:
             tunned_holder = []
             for tunned in find_in_data['LATER_LIST']:
                 find_tunned_profile_in_data = data_base.db.Station_profile.find_one({
                     '_STATION_':tunned['station']
                 })
                 tunned_pckt = {   
                    'STATION': tunned['station'],
                    'PROFILE_IMAGE':find_tunned_profile_in_data['_IMAGE_']
                }
                 

                 tunned_holder.append(tunned_pckt)
             return jsonify(tunned_holder)
    return render_login_page()
@app.route('/dlt_tund_sta')
def removing_removing_tunned_station():
    browser_cookie = request.cookies.get('U_I_S_N')
    find_in_db = data_base.db.Station_profile.find_one({
        '_COOKIE_':browser_cookie
    })
    if find_in_db:
        station_to_delete = request.args.get('data')
        load_to_json = json.loads(station_to_delete)
        pulling_this = load_to_json['st_n']
        find_in_list = data_base.db.Station_profile.update_one(
            {'_COOKIE_': browser_cookie},
            {'$pull': {'LATER_LIST': {'station': pulling_this}}}
                     )
        removing_from_clone_db = data_base.db.Clone_data.delete_one({'TUNNED_STATION':pulling_this,'TUNNER':browser_cookie})         
        return jsonify({'path':'static\\tunes\\upload_comment.mp3'})
    return render_login_page()

@app.route('/plc_to_rqstd_sta',methods=['GET'])
def placing_user_to_requested_station():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        requested_station = request.args.get('data')
        load_to_json = json.loads(requested_station)
        requested_station_name = load_to_json['st_n']
        find_station = data_base.db.Station_profile.find_one({
            '_STATION_':requested_station_name
        })
        station_info_pack = {
            'STATION':find_station['_STATION_'],
            'STATION_IMAGE':find_station['_IMAGE_'],
            'USERSELF':find_station['_USERSELF_'],
            'DESCRIPTION':find_station['_DESCRIPTION_']
        }
        return render_template('sta_home.html',files=['static\\css\\sta_home.css','static\\js\\sta_home.js'],data=station_info_pack)
    return render_login_page()

@app.route('/mk_req_fr_wvs')
def loads_tunned_stations_waves():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        station_name = request.args.get('nm')
        page_number = int(request.args.get('pag_num'))
        page_size  = int(request.args.get('pag_sze'))
        skip_count = (page_number - 1) * page_size
        find_in_data = data_base.db.Wave_packages.find({
            'STATION_NAME':station_name
        }).skip(skip_count).limit(page_size)
        wave_holder = []
        for wv_pckt in find_in_data:
            waves = {
                'STATION_NAME':wv_pckt['STATION_NAME'],
                'WAVE_FILE':os.path.join(app.config['WAVES_FOLDER'],wv_pckt['WAVE_FILE']),
                'WAVE_TITLE':wv_pckt['WAVE_TITLE'],
                'WAVE_TOPEN':wv_pckt['WAVE_TOPEN'],
                'TIME':wv_pckt['TIME']
            }
            wave_holder.append(waves)
        return jsonify({'pckt':wave_holder})
    return render_login_page()



@app.route('/mk_vw', methods=['GET'])
def making_view_for_wave():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_': browser_cookie
        })
        station_name = find_in_db['_STATION_']
        requested_wave = request.args.get('obj')
        load_to_json = json.loads(requested_wave)
        if load_to_json:
            if load_to_json['STATION'] != station_name:
                view_doc = {
                    'STATION_NAME': load_to_json['STATION'],
                    'WAVE': load_to_json['WAVE'],
                    'TITLE': load_to_json['TITLE'],
                    'TOPEN': load_to_json['TOPEN'],
                    'DATE': load_to_json['DATE'],
                    'VIEWER': station_name
                }

                similar_doc = data_base.db.Views.find_one(view_doc)
                if similar_doc is None:
                    view_doc['VIEW_DATE'] = datetime.datetime.now().strftime('%d_%m_%Y')
                    data_base.db.Views.insert_one(view_doc)

            find_in_db_for_history_status = data_base.db.Station_profile.find_one({
            '_STATION_': station_name
        })
            if find_in_db_for_history_status:
             is_true = find_in_db_for_history_status['HISTORY']
             if is_true == 'true':
                history_doc = {
                    'STATION_NAME': load_to_json['STATION'],
                    'WAVE': load_to_json['WAVE'],
                    'TITLE': load_to_json['TITLE'],
                    'TOPEN': load_to_json['TOPEN'],
                    'DATE': load_to_json['DATE'],
                    'VIEWER': station_name
                }
                find_history = data_base.db.History.find_one(history_doc)
                if find_history is None:
                    history_doc[ 'VIEW_DATE'] = datetime.datetime.now().strftime('%d_%m_%Y'),
                    data_base.db.History.insert_one(history_doc)
                return jsonify({'msg': 'this is one view'})
             return jsonify({'msg': ''})
    return render_login_page()


@app.route('/ld_sta_tuneds')
def sending_tunned_station_tunneds():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        tunned_station = request.args.get('nm')
        if tunned_station:
            find_in_db = data_base.db.Station_profile.find_one({
                '_STATION_':tunned_station
            })
            if find_in_db:
                tunned_holder = []
                for tunned in find_in_db['LATER_LIST']:
                    find_station_profile_image = data_base.db.Station_profile.find_one({
                        '_STATION_':tunned['station']
                    })
                    tunned_pckt = {
                        'STATION':tunned['station'],
                        'STATION_IMAGE':find_station_profile_image['_IMAGE_']
                    }
                    tunned_holder.append(tunned_pckt)
                return jsonify({'data':tunned_holder})
    return render_login_page()

def add_number_suffixes(number):
     magnitude = 0
     while abs(number) >= 1000:
         magnitude += 1
         number /= 1000.0
     suffix = ['','K','M','B','T'][magnitude]
     formated_number = '{}{}'.format(number,suffix)
     return formated_number

@app.route('/wv_stat_dta',methods=['GET'])
def sending_views_and_tunnes_and_likes():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_data_of = request.args.get('brg_vw')
        load_to_json = json.loads(find_data_of)
        if load_to_json:
            find_tunes = data_base.db.Clone_data.find({'TUNNED_STATION':load_to_json['STATION']})        
            tunnes = add_number_suffixes(len(list(find_tunes)))
            find_in_love = data_base.db.Love.find({
                'LOVED_TO':load_to_json['STATION'],
                 'LOVED_TITLE':load_to_json['TITLE'],
                 'LOVED_DATE':load_to_json['DATE']
            })
            if find_in_love:
                love_holder = 0
                frm_num_lv = None
                for loves in find_in_love:
                    love_holder += 1
                    frm_num_lv = add_number_suffixes(love_holder)

            
            find_in_views = data_base.db.Views.find({
                'STATION_NAME':load_to_json['STATION'],
                'TITLE':load_to_json['TITLE'],
                'DATE':load_to_json['DATE']
            })
            if find_in_views:
                frm_num_vw = None
                views_holder = 0
                for views in find_in_views:
                    views_holder += 1
                    frm_num_vw = add_number_suffixes(views_holder)
                return jsonify({'views':frm_num_vw,'love':frm_num_lv,'tunes':tunnes})
            return jsonify({'msg':'nahi mila bhai'})
    return render_login_page()

@app.route('/brngs_tgs',methods=['GET'])
def sending_tunned_tags_of_users():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        find_in_db = data_base.db.Station_profile.find_one({
            '_COOKIE_':browser_cookie
        })
        page_number = int(request.args.get('cntrl_pag_num'))
        page_size = int(request.args.get('cntrl_pag_sze'))
        skip_count = (page_number - 1) * page_size
        find_trending = data_base.db.Station_profile.find({}).sort('TUNES',-1).skip(skip_count).limit(page_size)
        trend_holder = []
        for trend in find_trending:
           trend_holder.append(trend['_STATION_'])
        return jsonify({'trnd':trend_holder})
    return render_login_page()


@app.route('/rmv_prof_im',methods=['GET'])
def remove_profile_pic():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
     find_image_first = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
     if find_image_first['_IMAGE_'] != 'no_image':
      update_in_station_profile = data_base.db.Station_profile.update_one({'_COOKIE_': browser_cookie},
                                                                   {'$set': {'_IMAGE_': 'no_image'}})
      return jsonify({'is_':'true'})
     return jsonify({'is_':'false'})
    return render_login_page()

@app.route('/mk_rply_to_cmt',methods=['POST'])
def saving_comment_reply_in_db():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
     find_station_name = data_base.db.Station_profile.find_one({'_COOKIE_':browser_cookie})
     station_name = find_station_name['_STATION_']
     comment = request.files['cmt']
     commenter = request.form['cmtr']
     commented_commenter_date = request.form['cmt_td']
     commented_to_this_wave = request.form['cmtd_wv_sta']
     commented_wv_title = request.form['cmtd_wv_ttl']
     commetrs_file_name = request.form['cmp']
     time_stamp = datetime.datetime.now().strftime('%Y-%m-%d-%f')
     file_name = time_stamp + '_rply_' + station_name + comment.filename
     comment.save(os.path.join(app.config['REPLY'],file_name))
     data_base.db.Comment_replys.insert_one({'reply':file_name,'rplyr':station_name,
                                             'rply_to':commenter,'reply_on':time_stamp,'commter_commented_on':commented_commenter_date,
                                             'both_commented_to_wv_station':commented_to_this_wave,'commented_wave_ttl':commented_wv_title,'commenters_file_name':commetrs_file_name})
     return jsonify({'path':'static\\tunes\\upload_comment.mp3'})
    return render_login_page()
    

@app.route('/get_rplys',methods=['GET'])   
def getting_the_replys_of_selected_comment():
    browser_cookie = request.cookies.get('U_I_S_N')
    if browser_cookie:
        page_number = int(request.args.get('shr_pag_num'))
        page_size = int(request.args.get('shr_pag_sze'))
        slected_cmt = request.args.get('customData')
        load_to_json = json.loads(slected_cmt)
        ski_count = (page_number - 1) * page_size
        find_in_db = data_base.db.Comment_replys.find({
            'rply_to':load_to_json['cmtr'],
            'commter_commented_on':load_to_json['cmt_td'],
            'both_commented_to_wv_station':load_to_json['cmted_wv_sta'],
            'commented_wave_ttl':load_to_json['cmtd_wv_ttl'],
            'commenters_file_name':load_to_json['cmp']
        }).skip(ski_count).limit(page_size)
        if find_in_db:
            rplys_holder = []
            for reply in find_in_db:
                reply_pckt = {
                    'rply':reply['reply'],
                    'rplyr':reply['rplyr'],
                    'rply_to':reply['rply_to'],
                    'reply_on':reply['reply_on'],
                    'repr_ig':data_base.db.Station_profile.find_one({'_STATION_':reply['rplyr']})['_IMAGE_']
                }
                rplys_holder.append(reply_pckt)
            return jsonify({'data':rplys_holder})
    return render_login_page() 


def delete_processing_waves_after_some_period(folder_path, time_threshold):
    current_time = time.time()
    for files in os.listdir(folder_path):
        file_path = os.path.join(folder_path, files)
        if os.path.isfile(file_path) and (current_time - os.path.getatime(file_path) >= time_threshold):
            os.remove(file_path)
        else:
            pass





if __name__ == '__main__':
    folder_path = 'static\\processing_waves'
    time_threshold = 3600
    delete_processing_waves_after_some_period(folder_path,time_threshold)
    app.run(host='0.0.0.0', port=5000,debug=True)








               







