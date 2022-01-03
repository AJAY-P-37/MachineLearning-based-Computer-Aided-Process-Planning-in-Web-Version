from subprocess import Popen, PIPE
import sys
import json
import os


from tensorflow import keras
from sklearn.neural_network import MLPClassifier
import pickle
import numpy as np

process_list, dimensions_list, zipped, flag = [], [], None, 0
model = keras.models.load_model("MLP")

input_data = []
input_2d = []
NoT, NoTT, NoD, NoET, NoIT = 0, 0, 0, 0, 0


operations = ('Turning', 'Taper Turning', 'Drilling', 'External Threading', 'Internal Threading')
max_count = (5, 2, 3, 2, 1)

wp_dia, wp_len = 0, 0

sequence, workholding_list=[], []

def sequencing(sequence_no, zipped, NoT, NoTT, NoD, NoET, NoIT):
    global wp_len
    work_holding = ''
    sum_of_length = 0
    for i in zipped:
        if i[0] == 'Turning':
            sum_of_length += float(i[1][1])
        elif i[0] == "Taper Turning":
            sum_of_length += float(i[1][2])
    #print(sum_of_length)
    if sequence_no == 0:
        zipped = sorted(zipped, key=lambda x: float(x[1][0]), reverse=True)
        work_holding = 'Three jaw chuck'
    elif sequence_no == 2:
        turned, drilled = zipped[:NoT], zipped[NoT:]
        turned = sorted(turned, key=lambda x: x[1][0], reverse=True)
        zipped = turned[:]
        for i in drilled:
            for index, j in enumerate(turned):
                if i[1][2] == j[1][2] or i[1][1] + i[1][2] == j[1][1] + j[1][2]:
                    zipped.insert(index + 1, i)
        work_holding = 'Magnetic chuck'
    elif sequence_no in [1, 3, 4]:
        turned, drilled = zipped[:NoT], zipped[NoT:]
        turned = sorted(turned, key=lambda x: x[1][0], reverse=True)
        zipped = turned[:]
        for i in drilled:
            for index, j in enumerate(turned):
                if i[1][2] == j[1][2] or i[1][1] + i[1][2] == j[1][1] + j[1][2]:
                    zipped.insert(index + 1, i)
        work_holding = 'Three jaw chuck'
    elif sequence_no == 5:
        turned, tapered = zipped[:NoT], zipped[NoT:NoT + NoTT]
        #print(turned, tapered)
        turned = sorted(turned, key=lambda x: x[1][0], reverse=True)
        zipped = turned[:]
        zipped.insert(-1, tapered[0])
        work_holding = 'Three jaw chuck'
    if sum_of_length < wp_len:
        zipped.insert(0, ('Facing', [wp_dia, wp_len - sum_of_length]))
    else:
    
        return 'Warning', 'Work piece length is less than the 2D drawing length'
        
    return zipped, work_holding

def sorting(x):
    global operations
    for i in operations:
        if x[0] == i:
            return operations.index(i)

def zipping():
    global process_list, dimensions_list, zipped, flag, sequence, workholding_list

    zipped = list(zip(process_list, dimensions_list))
    zipped.sort(key=sorting)
    #print(zipped)

    # Facing
    input_data.extend([0.0] * ((2 - 0) * 3))

    NoT = process_list.count('Turning')

    for i in range(len(process_list)):
        if process_list[i] == 'Turning':
            input_data.extend(dimensions_list[i])
    input_data.extend([0.0] * ((5 - NoT) * 3))

    NoTT = process_list.count('Taper Turning')
    for i in range(len(process_list)):
        if process_list[i] == 'Taper Turning':
            input_data.extend(dimensions_list[i])
    input_data.extend([0.0] * ((2 - NoTT) * 4))

    NoD = process_list.count('Drilling')
    for i in range(len(process_list)):
        if process_list[i] == 'Drilling':
            input_data.extend(dimensions_list[i])
    input_data.extend([0.0] * ((3 - NoD) * 3))

    NoET = process_list.count('External Threading')
    for i in range(len(process_list)):
        if process_list[i] == 'External Threading':
            input_data.extend(dimensions_list[i])
    input_data.extend([0.0] * ((2 - NoET) * 3))

    NoIT = process_list.count('Internal Threading')
    for i in range(len(process_list)):
        if process_list[i] == 'Internal Threading':
            input_data.extend(dimensions_list[i])
    input_data.extend([0.0] * ((1 - NoIT) * 3))

    #print(input_data)
    input_2d.append(input_data)
    if flag == 0:
        sequence_no = model.predict(input_2d)
        sequence_no = np.argmax(sequence_no,axis=1)
    elif flag == 1:
        sequence_no = model.predict(input_2d)[0]
    #print('seq',sequence_no, zipped)
    zipped, work_holding = sequencing(sequence_no, zipped, NoT, NoTT, NoD, NoET, NoIT)
    #print(zipped)

    for i, j in enumerate(zipped):
        sequence.insert(i, j[0] + ' Ø' + str(j[1][0]) +
                        ' x ' + str(j[1][1]) + 'mm')
    workholding_list.insert(0, work_holding)




if __name__=='__main__':
    #data = sys.argv[1]
    #global model, flag, process_list, dimensions_list, wp_dia, wp_len
    data = "{'backendProcessList': ['Turning', 'Turning'], 'backendDimensionList': [['20', '30', '0'], ['30', '20', '30']], 'backendWpList': ['40', '60'], 'algo': 'ANN'}".replace("\'",'\"')
    #print(data)
    data = json.loads(data)


    if data["algo"] == "ANN":
        flag=0
        model = keras.models.load_model("MLP")
    elif data['algo'] == "RF":
        model = pickle.load(open("RandomForest.sav", 'rb'))
        flag=1
    elif data["algo"] == "MLP":
        model = pickle.load(open("MLPClassifier.sav", 'rb'))
        flag=1

    process_list = data["backendProcessList"]
    for i in data["backendDimensionList"]:
        t=[]
        for j in i:
            t.append(float(j))
        dimensions_list.append(t) 

    wp_dia = float(data["backendWpList"][0])
    wp_len = float(data["backendWpList"][1])

    zipping()

    print(json.dumps({'sequence':sequence, 'work_holding': workholding_list}))
    sys.stdout.flush()