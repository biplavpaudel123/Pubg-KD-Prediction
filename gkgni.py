import pickle

def load_model(file_path):
    """
    Load a trained model from a .pkl file.
    """
    with open(file_path, 'rb') as file:
        model = pickle.load(file)
    return model

def get_user_input():
    """
    Ask the user for kills and accuracy inputs.
    """
    headshotKills = float(input("Enter the number of headshot kills: "))
    dailyKills = float(input("Enter the number of daily kills: "))
    dailyWins = float(input("Enter the number of daily wins: "))
    maxKillStreaks = float(input("Enter the number of max kill streaks: "))
    top10s = float(input("Enter the number of top 10s: "))
    return headshotKills, dailyKills, dailyWins, maxKillStreaks, top10s

def predict_kd_ratio(model, headshotKills, dailyKills, dailyWins, maxKillStreaks, top10s):
    """
    Use the model to predict the K/D ratio based on the inputs.
    """
    # Correctly format the input data as a 2D array
    input_data = [[headshotKills, dailyKills, dailyWins, maxKillStreaks, top10s]]
    predicted_kd = model.predict(input_data)
    return predicted_kd[0]

def main():
    # Load the model
    model_path = "C:\\Users\\bipla\\Desktop\\predictionserver\\model.pkl"
    model = load_model(model_path)
    
    # Get user inputs
    headshotKills, dailyKills, dailyWins, maxKillStreaks, top10s = get_user_input()
    
    # Predict the K/D ratio
    predicted_kd = predict_kd_ratio(model, headshotKills, dailyKills, dailyWins, maxKillStreaks, top10s)
    
    # Display the predicted K/D ratio
    print(f"{predicted_kd}")

if __name__ == "__main__":
    main()
